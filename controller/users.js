const User = require('../models/user');


module.exports.new = (req, res) => {
    res.render('users/register');
}

module.exports.create = async (req, res, next) => {
    try {
        const newUser = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.email,
            email: req.body.email,
        }
        const pass = req.body.password;

        const user = new User(newUser);
        const registeredUser = await User.register(user, pass);

        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', '¡Bienvenido! Te has registrado exitosamente');

            res.redirect('/courses');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.login = (req, res) => {
    res.render('users/login');
}

module.exports.authenticate = (req, res, next) => {
    req.flash('success', '¡Bienvenido de nuevo! ');
    res.redirect('/courses');
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Desconectado exitosamente');
    res.redirect('/login');
}