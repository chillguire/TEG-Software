const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.courseSchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
});

// module.exports.userSchema = Joi.object({
//     firstName: Joi.string().required(),
//     lastName: Joi.string().required(),
//     username: Joi.string()
//         .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
//         .required(),
//     password: Joi.string()
//         .min(8)
//         .max(128)
//         .required(),
// });