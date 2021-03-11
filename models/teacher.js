const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const teacherSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    lessons: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
        }
    ],
    courses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Course',
        }
    ],
});

module.exports = mongoose.model('Teacher', teacherSchema);