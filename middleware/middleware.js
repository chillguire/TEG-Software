const { isValidObjectId } = require('mongoose');
module.exports.isValidMongoObject = function (req, res, next) {
    if (!isValidObjectId(req.params.id)) {
        req.flash('error', 'El curso no existe');
        return res.redirect('/courses');
    }
    next();
}

module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('warning', 'Necesitas haber iniciado sesión para hacer eso');
        return res.redirect('/login');
    }
    next();
}
// module.exports.isLoggedOut = function (req, res, next) {
//     if (req.isAuthenticated()) {
//         req.flash('warning', 'Ya iniciaste sesión');
//         return res.redirect('/courses');
//     }
//     next();
// }

const { courseSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError');
module.exports.validateCourse = function (req, res, next) {
    const course = {
        name: req.body.name,
        description: req.body.description,
    }

    const { error } = courseSchema.validate(course);

    if (error) {
        // const msg = error.details.map(el => el.message).join(',');
        const errors = [];
        for (let i = 0; i < error.details.length; i++) {
            errors[i] = error.details[i].message;
            throw new ExpressError(errors, 400);
        }
    } else {
        next();
    }
}
