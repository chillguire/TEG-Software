const express = require('express');
const router = express.Router();

const users = require('../controller/users');

const passport = require('passport');

const { isLoggedIn, isLoggedOut, isAdmin, isUUIDvalid, validateUser } = require('../middleware/middleware');


router.route('/register')
    .get(isLoggedOut, users.renderRegisterForm)
    .post(isLoggedOut, validateUser, users.register);

router.route('/login')
    .get(isLoggedOut, users.renderLoginForm)
    .post(passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: { type: 'error', message: 'Usuario o contraseña incorrectos' }
    }), users.login);

router.route('/forgot-password')
    .get(isLoggedOut, users.renderForgotPasswordForm)
    .post(isLoggedOut, users.forgotPassword);

router.route('/reset/:uuid')
    .get(isLoggedOut, isUUIDvalid, users.renderResetPasswordForm)
    .put(isLoggedOut, isUUIDvalid, users.resetPassword);

router.route('/users/invite')
    .get(isLoggedIn, isAdmin, users.renderInviteForm)
    .post(isLoggedIn, isAdmin, users.inviteUsers);

router.get('/logout', isLoggedIn, users.logout);


module.exports = router;