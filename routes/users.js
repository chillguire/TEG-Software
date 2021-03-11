const express = require('express');
const router = express.Router();

const users = require('../controller/users');

const passport = require('passport');

const { isLoggedIn, /*isLoggedOut,*/ validateUser } = require('../middleware/middleware');


//** ROUTES
router.route('/register')
    .get(/*isLoggedOut,*/users.new)
    .post(/*isLoggedOut,*/ validateUser, users.create);

router.route('/login')
    .get(/*isLoggedOut,*/users.login)
    .post(/*isLoggedOut,*/ passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), users.authenticate);

router.get('/logout', isLoggedIn, users.logout);


module.exports = router;