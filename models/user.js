const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
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
    resetPasswordURL: {
        type: String,
        unique: true,
        sparse: true,
    },
    resetPasswordExpires: {
        type: Date,
    },
    avatar: {
        url: {
            type: String,
            default: 'https://iupac.org/wp-content/uploads/2018/05/default-avatar.png',
        },
        filename: {
            type: String,
            default: 'default-avatar',
        },
    },
});

const options = {
    errorMessages: {
        MissingPasswordError: 'No se proporcionó una contraseña',
        IncorrectPasswordError: 'Usuario o contraseña incorrectos',
        IncorrectUsernameError: 'Usuario o contraseña incorrectos',
        MissingUsernameError: 'No se proporcionó un e-mail',
        UserExistsError: 'Ya existe un usuario con ese e-mail'
    },
};

userSchema.plugin(passportLocalMongoose, options);


module.exports = mongoose.model('User', userSchema);