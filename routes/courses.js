const express = require('express');
const router = express.Router();

const courses = require('../controller/courses');

const { isLoggedIn, isAdmin, doesCourseExists, belongsToCourse, availableInstructors, availableStudents, validateCourse } = require('../middleware/middleware');


router.route('/')
    .get(isLoggedIn, courses.renderAll)
    .post(isLoggedIn, isAdmin, validateCourse, courses.create);

router.get('/new', isLoggedIn, isAdmin, availableInstructors, courses.renderNewForm);

router.route('/:id')
    .get(isLoggedIn, doesCourseExists, belongsToCourse, courses.renderSpecific)
    .put(isLoggedIn, isAdmin, doesCourseExists, validateCourse, courses.update)
    .delete(isLoggedIn, isAdmin, doesCourseExists, courses.delete);

router.get('/:id/edit', isLoggedIn, isAdmin, doesCourseExists, availableInstructors, courses.renderEditForm);

router.route('/:id/students')
    .get(isLoggedIn, isAdmin, doesCourseExists, availableStudents, courses.renderStudentsForm)
    .put(isLoggedIn, isAdmin, doesCourseExists, /*validateStudents,*/ courses.updateStudents);


module.exports = router;