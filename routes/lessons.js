const express = require('express');
const router = express.Router({ mergeParams: true });

const lessons = require('../controller/lessons');

const { isLoggedIn, doesCourseExists, doesLessonExists, validateLesson } = require('../middleware/middleware');


//** ROUTES
router.route('/')
    .post(isLoggedIn, doesCourseExists, validateLesson, lessons.create);

router.get('/new', isLoggedIn, doesCourseExists, lessons.new);

router.route('/:lessonID')
    .get(isLoggedIn, doesCourseExists, doesLessonExists, lessons.show)
    .put(isLoggedIn, doesCourseExists, doesLessonExists, validateLesson, lessons.update)
    .delete(isLoggedIn, doesCourseExists, doesLessonExists, lessons.delete);

router.get('/:lessonID/edit', isLoggedIn, doesCourseExists, doesLessonExists, lessons.edit);

module.exports = router;