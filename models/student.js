const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const studentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    courses: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Course',
        }
    ],
});

module.exports = mongoose.model('Student', studentSchema);