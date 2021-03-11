const express = require('express');
const router = express.Router();

const courses = require('../controller/courses');

const { isLoggedIn, doesCourseExists, validateCourse } = require('../middleware/middleware');


//** ROUTES
router.route('/')
    .get(isLoggedIn, courses.index)
    .post(isLoggedIn, validateCourse, courses.create);

router.get('/new', isLoggedIn, courses.new);

router.route('/:id')
    .get(isLoggedIn, doesCourseExists, courses.show)
    .put(isLoggedIn, doesCourseExists, validateCourse, courses.update)
    .delete(isLoggedIn, doesCourseExists, courses.delete);

router.get('/:id/edit', isLoggedIn, doesCourseExists, courses.edit);


module.exports = router;