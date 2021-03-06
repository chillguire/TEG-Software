const Joi = require('joi');

module.exports.courseSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
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