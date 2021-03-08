const express = require('express');
const router = express.Router();

const courses = require('../controller/courses');

const { isLoggedIn, isValidMongoObject, validateCourse } = require('../middleware/middleware');

const catchAsync = require('../utils/catchAsync');


//** ROUTES
router.route('/')
    .get(isLoggedIn, catchAsync(courses.index))
    .post(isLoggedIn, validateCourse, catchAsync(courses.create));

router.get('/new', isLoggedIn, courses.new);

router.route('/:id')
    .get(isLoggedIn, isValidMongoObject, catchAsync(courses.show))
    .put(isLoggedIn, isValidMongoObject, validateCourse, catchAsync(courses.update))
    .delete(isLoggedIn, isValidMongoObject, catchAsync(courses.delete));

router.get('/:id/edit', isLoggedIn, isValidMongoObject, catchAsync(courses.edit));


module.exports = router;