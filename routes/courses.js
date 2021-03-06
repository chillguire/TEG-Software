const express = require('express');
const router = express.Router();

const Course = require('../models/course');

const { isLoggedIn } = require('../middleware/auth');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { courseSchema } = require('../schemas');
const { isValidObjectId } = require('mongoose');


//** MIDDLEWARE - will probably need later in other files
function validateCourse(req, res, next) {
    const course = {
        name: req.body.name,
        description: req.body.description,
    }

    const { error } = courseSchema.validate(course);

    if (error) {
        // const msg = error.details.map(el => el.message).join(',');
        const errors = [];
        for (let i = 0; i < error.details.length; i++) {
            errors[i] = error.details[i].message;
            throw new ExpressError(errors, 400);
        }
    } else {
        next();
    }
}

//** ROUTES
router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const courses = await Course.find({})
    res.render('courses/index', { courses });
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('courses/new');
});

router.post('/', isLoggedIn, validateCourse, catchAsync(async (req, res, next) => {
    const newCourse = {
        name: req.body.name,
        description: req.body.description,
    }

    const course = new Course(newCourse);
    await course.save();

    req.flash('success', 'Successfully created a new course');

    res.redirect(`/courses/${course._id}`);
}));

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    if (!isValidObjectId(req.params.id)) {
        req.flash('error', 'Course does not exist');
        return res.redirect('/courses');
    }
    const course = await Course.findById(req.params.id);
    if (!course) {
        req.flash('error', 'Course does not exist');
        return res.redirect('/courses');
    }
    res.render('courses/show', { course });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        req.flash('error', 'Course does not exist');
        res.redirect('/courses');
    }
    res.render('courses/edit', { course });
}));

router.put('/:id', isLoggedIn, validateCourse, catchAsync(async (req, res) => {
    const editedCourse = {
        name: req.body.name,
        description: req.body.description,
    }

    const course = await Course.findByIdAndUpdate(req.params.id, { ...editedCourse });

    req.flash('success', 'Successfully updated course');

    res.redirect(`/courses/${course._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    await Course.findByIdAndDelete(req.params.id);

    req.flash('success', 'Successfully deleted course');

    res.redirect(`/courses`);
}));

module.exports = router;