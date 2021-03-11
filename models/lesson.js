const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const lessonSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    OGdescription: {
        type: String,
        required: true,
    },
    descriptionMD: {
        type: String,
        required: true,
    },
    sanitizedDescription: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true,
    },
});

module.exports = mongoose.model('Lesson', lessonSchema);