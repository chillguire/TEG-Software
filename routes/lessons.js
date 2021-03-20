const express = require('express');
const router = express.Router({ mergeParams: true });

const lessons = require('../controller/lessons');

const { isLoggedIn, isInstructor, doesCourseExists, belongsToCourse, doesLessonExists, validateLesson } = require('../middleware/middleware');


router.route('/')
    .post(isLoggedIn, isInstructor, doesCourseExists, belongsToCourse, validateLesson, lessons.create);

router.get('/new', isLoggedIn, isInstructor, doesCourseExists, belongsToCourse, lessons.renderNewForm);

router.route('/:lessonID')
    .get(isLoggedIn, doesCourseExists, belongsToCourse, doesLessonExists, lessons.renderSpecific)
    .put(isLoggedIn, isInstructor, doesCourseExists, belongsToCourse, doesLessonExists, validateLesson, lessons.update)
    .delete(isLoggedIn, isInstructor, doesCourseExists, belongsToCourse, doesLessonExists, lessons.delete);

router.get('/:lessonID/edit', isLoggedIn, isInstructor, doesCourseExists, belongsToCourse, doesLessonExists, lessons.renderEditForm);


module.exports = router;