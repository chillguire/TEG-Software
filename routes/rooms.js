const express = require('express');
const router = express.Router();

const rooms = require('../controller/rooms');

const { isLoggedIn, doesCourseExists } = require('../middleware/middleware');


//** ROUTES
router.get('/:id/:room', isLoggedIn, doesCourseExists, rooms.joinRoom);


module.exports = router;