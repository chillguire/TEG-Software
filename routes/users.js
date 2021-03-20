const express = require('express');
const router = express.Router();

const users = require('../controller/users');

const passport = require('passport');

const { isLoggedIn, /*isLoggedOut,*/ validateUser } = require('../middleware/middleware');


router.route('/register')
    .get(/*isLoggedOut,*/users.renderRegisterForm)
    .post(/*isLoggedOut,*/validateUser, users.register);

router.route('/login')
    .get(/*isLoggedOut,*/users.renderLoginForm)
    .post(/*isLoggedOut,*/passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: { type: 'error', message: 'Usuario o contraseña incorrectos' }
    }), users.login);

router.get('/logout', isLoggedIn, users.logout);


module.exports = router;