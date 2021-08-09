const express = require('express');
const router = express.Router();

// const multer = require('multer');
// const upload = multer({
//     dest: 'uploads/',
//     limits: { fileSize: 500000 }
// });

const users = require('../controller/users');

const passport = require('passport');

const { isLoggedIn, isLoggedOut, isAdmin, isUUIDvalid, validateUser, doesUserExists, belongsToProfile } = require('../middleware/middleware');


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

router.route('/user/invite')
    .get(isLoggedIn, isAdmin, users.renderInviteForm)
    .post(isLoggedIn, isAdmin, users.inviteUsers);

router.get('/logout', isLoggedIn, users.logout);

router.route('/user/:userID')
    .get(isLoggedIn, doesUserExists, users.renderSpecific)
    .put(isLoggedIn, doesUserExists, belongsToProfile,/* upload.single('avatar'),*/ users.update);

router.get('/user/:userID/edit', isLoggedIn, doesUserExists, belongsToProfile, users.renderEditForm);


module.exports = router;