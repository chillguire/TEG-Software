const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ChatSchema = new Schema({
    author: String,
    content: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Chat', ChatSchema);