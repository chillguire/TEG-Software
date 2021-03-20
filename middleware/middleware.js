const { isValidObjectId } = require('mongoose');
const Course = require('../models/course');
const Lesson = require('../models/lesson');
const User = require('../models/user');

const { courseSchema, lessonSchema, userSchema } = require('./schemas');


// check if lesson/course exists (or if param is a valid mongo object)
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

// check if user is logged in
module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('warning', 'Necesitas iniciar sesión para hacer eso');
        return res.redirect('/login');
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