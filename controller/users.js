const User = require('../models/user');
const InvitedUser = require('../models/invitedUser');

const { sendEmail } = require('../middleware/middleware');

const { v4: uuidV4 } = require('uuid');

const sanitizeHtml = require('sanitize-html');


module.exports.renderRegisterForm = (req, res) => {
    if (req.session.user) {
        const user = req.session.user;
        req.session.user = null;
        res.render('users/register', { user: user });
    } else {
        const user = {
            firstName: '',
            lastName: '',
            email: '',
        }
        res.render('users/register', { user: user });
    }
}

module.exports.register = async (req, res, next) => {
    try {

        let isUserInvited = await InvitedUser.findOne({ email: req.body.email });

        if (!isUserInvited && (req.body.email != process.env.MAIL_ACCOUNT)) {
            req.flash('error', `No estás invitado al sistema`);
            return res.redirect('/register');
        } else if (req.body.email == process.env.MAIL_ACCOUNT) {
            isUserInvited = {
                type: 'Admin',
            }
        }

        const newUser = {
            firstName: sanitizeHtml(req.body.firstName, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            lastName: sanitizeHtml(req.body.lastName, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            username: sanitizeHtml(req.body.email, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            email: sanitizeHtml(req.body.email, {
                allowedTags: [],
                allowedAttributes: {}
            }),
            type: isUserInvited.type,
        }
        const pass = req.body.password;

        const user = new User(newUser);
        const registeredUser = await User.register(user, pass);

        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', '¡Bienvenido! Te has registrado exitosamente');
            res.redirect('/courses');
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res, next) => {
    req.flash('success', '¡Bienvenido de nuevo! ');
    res.redirect('/courses');
}

module.exports.renderForgotPasswordForm = (req, res) => {
    res.render('users/forgotPassword');
}

module.exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            req.flash('success', `Un correo fue enviado a ${req.body.email} con los siguientes pasos`);
            return res.redirect('/login');
        }

        user.resetPasswordURL = uuidV4();
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();

        sendEmail({
            to: user.email,
            from: `Sistema de Gestión Académica a Distancia ${process.env.MAIL_ACCOUNT}`,
            subject: `Solicitud de restablecimiento de contraseña`,
            text: `Hola ${user.firstName} ${user.lastName}, solicitaste restablecer tu contraseña en nuestra aplicación, para hacerlo, ve al siguiente link para completar el proceso. \n\nhttp://${req.headers.host}/reset/${user.resetPasswordURL}\n\nSi no fuiste tú quién pidió restablecer la contraseña, no te preocupes, ignora este correo y tu contraseña no será cambiada.`,
        });

        req.flash('success', `Un correo fue enviado a ${user.email} con los siguientes pasos`);
        return res.redirect('/login');
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect(`/login`);
    }
}

module.exports.renderResetPasswordForm = async (req, res) => {
    res.render('users/resetPassword', { uuid: res.locals.uuid.resetPasswordURL });
}

module.exports.resetPassword = async (req, res) => {
    try {
        const user = res.locals.uuid;

        await user.setPassword(req.body.password);
        user.resetPasswordURL = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        sendEmail({
            to: user.email,
            from: `Sistema de Gestión Académica a Distancia ${process.env.MAIL_ACCOUNT}`,
            subject: `Contraseña cambiada`,
            text: `Hola ${user.firstName} ${user.lastName}, esto es una confirmación de que tu contraseña para la cuenta con el correo ${user.email} acaba de ser cambiada.`,
        });

        req.login(user, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', '¡Bienvenido! Has actualizado tu contraseña exitosamente');
            res.redirect('/courses');
        });
    } catch (error) {
        req.flash('error', error.message);
        return res.redirect(`/login`);
    }


}

module.exports.renderInviteForm = (req, res) => {
    res.render('users/inviteUsers');
}

module.exports.inviteUsers = async (req, res) => {
    try {
        const doesUserAlreadyExists = await User.findOne({ email: req.body.email });
        if (doesUserAlreadyExists) {
            req.flash('warning', `El correo ya está registrado en el sistema`);
            return res.redirect('/courses');
        }

        const newInvitedUser = {
            email: sanitizeHtml(req.body.email, {
                allowedTags: [],
                allowedAttributes: {},
            }),
            type: sanitizeHtml(req.body.rol, {
                allowedTags: [],
                allowedAttributes: {},
            }),
        }
        const invitedUser = new InvitedUser(newInvitedUser)
        await invitedUser.save();

        sendEmail({
            to: invitedUser.email,
            from: `Sistema de Gestión Académica a Distancia ${process.env.MAIL_ACCOUNT}`,
            subject: `Invitado al sistema de gestión académica a distancia`,
            // cambiar invitedUser.type to its translation in spanish
            text: `Hola, este es un correo para informarle de que ha sido invitado al sistema de gestión académica a distancia como ${invitedUser.type}. Para ingresar ve al siguiente link para iniciar el proceso de registro.\n\nhttp://${req.headers.host}/register`,
        });

        req.flash('success', 'Usuario invitado exitosamente');
        res.redirect(`/courses`);
    } catch (error) {
        if (error.name === 'MongoError' && error.code === 11000) {
            req.flash('error', 'Ya este correo se encuentra invitado al sistema');
        } else if (error.name === 'ValidationError' && error.errors['type']) {
            req.flash('error', `La entrada '${error.errors['type'].value}' no es válida`);
        } else {
            req.flash('error', error.message);
        }
        res.redirect(`/users/invite`);
    }
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Desconectado exitosamente');
    res.redirect('/login');
}