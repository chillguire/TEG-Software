const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    roomID: {
        type: String,
        required: true,
        unique: true,
    },
    // instructor: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User',
    // },
    // lessons: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Lesson'
    //     }
    // ],
    // students: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: 'Student'
    //     }
    // ],
});


module.exports = mongoose.model('Course', courseSchema)