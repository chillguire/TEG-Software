const express = require('express');
const router = express.Router();

const Course = require('../models/course');

const { isLoggedIn } = require('../middleware/auth');
const { isValidMongoObject } = require('../middleware/verification');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


//** ROUTES
router.get('/:id/:room', isLoggedIn, isValidMongoObject, catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        req.flash('error', 'El curso no existe');
        return res.redirect('/courses');
    }
    const room = await Course.findOne({ roomID: req.params.room });
    if (!room) {
        req.flash('error', 'La sala no existe');
        return res.redirect(`/courses/${req.params.id}`);
    }
    res.render('courses/room', { roomID: room, course: course });
}));

module.exports = router;