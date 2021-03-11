const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Lesson = require('./lesson');


const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    roomID: {
        type: String,
        required: true,
        unique: true,
    },
    lessons: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Lesson',
        }
    ],
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
});

// remove associated lessons to one course
courseSchema.post('findOneAndDelete', async function (document) {
    if (document) {
        await Lesson.deleteMany({
            _id: {
                $in: document.lessons
            }
        });
    }
});


module.exports = mongoose.model('Course', courseSchema);