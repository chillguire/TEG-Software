module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('warning', 'You need to be logged in to do that.');
        return res.redirect('/login');
    }
    next();
}
