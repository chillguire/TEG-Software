const Joi = require('joi');

module.exports.courseSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
});;