const BaseJoi = require('joi').extend(require('@joi/date'));
const { number } = require('joi');
const sanitizeHtml = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
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
})

const Joi = BaseJoi.extend(extension)

module.exports.postschema = Joi.object({
    post: Joi.object({
        title: Joi.string().required().escapeHTML(),
        body: Joi.string().required().escapeHTML(),
        created: Joi.string().required()
    }).required()
});

module.exports.replieschema = Joi.object({
    reply: Joi.object({
        body: Joi.string().required().escapeHTML()
    }).required()
})

