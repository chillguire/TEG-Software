const Joi = require('joi');


module.exports.courseSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            'string.empty': `"Nombre" no puede estar vacío`,
            'any.required': `"Nombre" es un campo requerido`,
        }),
    description: Joi.string()
        .required()
        .messages({
            'string.empty': `"Descripción" no puede estar vacío`,
            'any.required': `"Descripción" es un campo requerido`,
        }),
    instructor: Joi.string()
        .allow(''),
});

module.exports.lessonSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            'string.empty': `"Nombre" no puede estar vacío`,
            'any.required': `"Nombre" es un campo requerido`,
        }),
    description: Joi.string()
        .required()
        .messages({
            'string.empty': `"Descripción" no puede estar vacío`,
            'any.required': `"Descripción" es un campo requerido`,
        }),
});

module.exports.userSchema = Joi.object({
    firstName: Joi.string()
        .required()
        .messages({
            'string.empty': `"Nombre" no puede estar vacío`,
            'any.required': `"Nombre" es un campo requerido`,
        }),
    lastName: Joi.string()
        .required()
        .messages({
            'string.empty': `"Apellido" no puede estar vacío`,
            'any.required': `"Apellido" es un campo requerido`,
        }),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: true } })
        .required()
        .messages({
            'string.empty': `"E-mail" no puede estar vacío`,
            'any.required': `"E-mail" es un campo requerido`,
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.empty': `"Contraseña" no puede estar vacío`,
            'any.required': `"Contraseña" es un campo requerido`,
        }),
});