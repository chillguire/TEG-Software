const express = require('express');
const router = express.Router({ mergeParams: true });

const Course = require('../models/course');
// const Lesson = require('../models/lesson');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { lessonSchema } = require('../schemas');


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
