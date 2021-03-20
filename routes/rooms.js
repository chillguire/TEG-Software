const express = require('express');
const router = express.Router();

const rooms = require('../controller/rooms');

const { isLoggedIn, doesCourseExists, belongsToCourse } = require('../middleware/middleware');


router.get('/:id/:room', isLoggedIn, doesCourseExists, belongsToCourse, rooms.joinRoom);


module.exports = router;