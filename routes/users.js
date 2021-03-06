const express = require('express');
const router = express.Router();

const User = require('../models/user');

const passport = require('passport');

const { isLoggedIn } = require('../middleware/auth');

const catchAsync = require('../utils/catchAsync');


//** ROUTES
router.get('/register', (req, res) => {
    res.render('users/register');
});

router.post('/register', catchAsync(async (req, res, next) => {
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
            req.flash('success', 'Welcome, you have successfully registered');

            res.redirect('/courses');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', {
    // successRedirect: '/courses',
    failureRedirect: '/login',
    failureFlash: true
}), (req, res, next) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/courses');
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.flash('success', 'Logged out');
    res.redirect('/login');
    console.log('logged out');
});

module.exports = router;