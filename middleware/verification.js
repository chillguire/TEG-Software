const { isValidObjectId } = require('mongoose');

module.exports.isValidMongoObject = function (req, res, next) {
    if (!isValidObjectId(req.params.id)) {
        req.flash('error', 'El curso no existe');
        return res.redirect('/courses');
    }
    next();
}