const Course = require('../models/course');


module.exports.joinRoom = async (req, res) => {
    const room = await Course.findOne({ roomID: req.params.room });
    if (!room) {
        req.flash('error', 'La sala no existe');
        return res.redirect(`/courses/${req.params.id}`);
    }
    res.render('courses/room', { roomID: room, course: res.locals.course });
}