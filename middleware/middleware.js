const { isValidObjectId } = require('mongoose');
const Course = require('../models/course');
const Lesson = require('../models/lesson');
const User = require('../models/user');

const { courseSchema, lessonSchema, userSchema } = require('./schemas');

const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;


// check if x exists or is valid
module.exports.doesCourseExists = async function (req, res, next) {
    let course;
    if (!isValidObjectId(req.params.id) || !(course = await Course.findById(req.params.id))) {
        req.flash('error', 'El curso no existe');
        return res.redirect('/courses');
    }
    res.locals.course = course;
    next();
}
module.exports.doesLessonExists = async function (req, res, next) {
    let lesson;
    if (!isValidObjectId(req.params.lessonID) || !(lesson = await Lesson.findById(req.params.lessonID))) {
        req.flash('error', 'La lección no existe');
        return res.redirect(`/courses/${res.locals.course._id}`);
    }
    res.locals.lesson = lesson;
    next();
}
module.exports.isUUIDvalid = async function (req, res, next) {
    const uuid = await User.findOne({ resetPasswordURL: req.params.uuid, resetPasswordExpires: { $gt: Date.now() } });
    if (!uuid) {
        return res.redirect('/login');
    }
    res.locals.uuid = uuid;
    next();
}
module.exports.doesUserExists = async function (req, res, next) {
    let user;
    if (!isValidObjectId(req.params.userID) || !(user = await User.findById(req.params.userID))) {
        req.flash('error', 'El usuario no existe');
        return res.redirect(`/courses`);
    }
    res.locals.user = user;
    next();
}

// check if user is logged in
module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('warning', 'Necesitas iniciar sesión para hacer eso');
        return res.redirect('/login');
    }
    next();
}
module.exports.isLoggedOut = function (req, res, next) {
    if (req.isAuthenticated()) {
        req.flash('warning', 'Ya estás dentro del sistema');
        return res.redirect('/courses');
    }
    next();
}

// check user role
module.exports.isAdmin = function (req, res, next) {
    if (!(req.user.type === 'Admin')) {
        req.flash('warning', 'No tienes los permisos para hacer eso');
        return res.redirect('/courses');
    }
    next();
}
module.exports.isInstructor = function (req, res, next) {
    if (!(req.user.type === 'Instructor')) {
        req.flash('warning', 'No tienes los permisos para hacer eso');
        return res.redirect('/courses');
    }
    next();
}

// check if user has authorization 
module.exports.belongsToCourse = function (req, res, next) {
    if ((req.user.type === 'Admin') || (req.user._id.equals(res.locals.course.instructor)) || res.locals.course.students.includes(req.user._id)) {
        return next();
    }
    req.flash('warning', 'No puedes acceder a este curso');
    return res.redirect('/courses');
}
module.exports.belongsToProfile = function (req, res, next) {
    if ((req.user._id.equals(res.locals.user._id))) {
        return next();
    }
    req.flash('warning', 'No estás autorizado para hacer esto');
    return res.redirect('/courses');
}

// retrieve list of x roles
module.exports.availableInstructors = async function (req, res, next) {
    const instructors = await User.find({ type: 'Instructor' }).sort({ firstName: 'desc' });
    res.locals.instructors = instructors;
    next();
}
module.exports.availableStudents = async function (req, res, next) {
    const students = await User.find({ type: 'Student' }).sort({ firstName: 'desc' });
    res.locals.students = students;
    next();
}

// validate inputs
module.exports.validateCourse = function (req, res, next) {
    const course = {
        name: req.body.name,
        description: req.body.description,
        instructor: req.body.instructor,
    }

    const { error } = courseSchema.validate(course, { abortEarly: false });
    if (error) {
        const errors = [];
        for (let i = 0; i < error.details.length; i++) {
            errors[i] = error.details[i].message;
        }
        req.session.course = course;
        req.flash('error', errors);
    }
    next();
}
module.exports.validateLesson = function (req, res, next) {
    const lesson = {
        name: req.body.name,
        description: req.body.description,
    }

    const { error } = lessonSchema.validate(lesson, { abortEarly: false });

    if (error) {
        const errors = [];
        for (let i = 0; i < error.details.length; i++) {
            errors[i] = error.details[i].message;
        }
        req.session.lesson = lesson;
        req.flash('error', errors);
    }
    next();
}
module.exports.validateUser = function (req, res, next) {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    }

    const { error } = userSchema.validate(user, { abortEarly: false });

    if (error) {
        const errors = [];
        for (let i = 0; i < error.details.length; i++) {
            errors[i] = error.details[i].message;
        }
        const unpasswordedUser = Object.assign({}, user);
        delete unpasswordedUser.password;
        req.session.user = unpasswordedUser;
        req.flash('error', errors);
    }
    next();
}

// send mails
const createSmtpTransport = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((error, token) => {
            if (error) {
                reject("Failed to create access token");
            }
            resolve(token);
        });
    });

    const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_ACCOUNT,
            accessToken: accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
        }
    });

    return smtpTransport;
};
module.exports.sendEmail = async (emailOptions) => {
    try {
        let emailTransporter = await createSmtpTransport();
        await emailTransporter.sendMail(emailOptions);
    } catch (error) {
        console.log(error);
    }
};
