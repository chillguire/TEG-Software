const express = require('express');
const router = express.Router();

const chats = require('../controller/chats');

const { isLoggedIn } = require('../middleware/middleware');


router.get('/chat', isLoggedIn, chats.render);


module.exports = router;