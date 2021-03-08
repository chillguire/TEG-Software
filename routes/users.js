const express = require('express');
const router = express.Router();

const users = require('../controller/users');

const passport = require('passport');

const { isLoggedIn, /*isLoggedOut*/ } = require('../middleware/middleware');

const catchAsync = require('../utils/catchAsync');


//** ROUTES
router.route('/register')
    .get(/*isLoggedOut,*/users.new)
    .post(/*isLoggedOut,*/ catchAsync(users.create));

router.route('/login')
    .get(/*isLoggedOut,*/users.login)
    .post(/*isLoggedOut,*/ passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true
    }), users.authenticate);

router.get('/logout', isLoggedIn, users.logout);


module.exports = router;