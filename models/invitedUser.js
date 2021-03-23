const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const invitedUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['Admin', 'Instructor', 'Student'],
        default: 'Student',
    },
});


module.exports = mongoose.model('InvitedUser', invitedUserSchema);