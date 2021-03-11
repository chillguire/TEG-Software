const { isValidObjectId } = require('mongoose');
const Course = require('../models/course');
const Lesson = require('../models/lesson');

//check if lesson/course exists (or if param is a valid mongo object)
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
        req.flash('warning', 'Necesitas haber iniciado sesión para hacer eso');
        return res.redirect('/login');
    }
    next();
}

// validate inputs
const { courseSchema, lessonSchema, userSchema } = require('../schemas');


module.exports.validateCourse = function (req, res, next) {
    const course = {
        name: req.body.name,
        description: req.body.description,
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
