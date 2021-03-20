const User = require('../models/user');

const sanitizeHtml = require('sanitize-html');


module.exports.renderRegisterForm = (req, res) => {
    if (req.session.user) {
        const user = req.session.user;
        req.session.user = null;
        res.render('users/register', { user: user });
    } else {
        const user = {
            firstName: '',
            lastName: '',
            email: '',
        }
        res.render('users/register', { user: user });
    }
}

module.exports.register = async (req, res, next) => {
    try {
        const newUser = {
            firstName: sanitizeHtml(req.body.firstName, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            lastName: sanitizeHtml(req.body.lastName, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            username: sanitizeHtml(req.body.email, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            email: sanitizeHtml(req.body.email, {
                allowedTags: [],
                allowedAttributes: {}
            }),
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
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res, next) => {
    req.flash('success', '¡Bienvenido de nuevo! ');
    res.redirect('/courses');
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Desconectado exitosamente');
    res.redirect('/login');
}