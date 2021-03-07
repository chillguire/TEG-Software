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
