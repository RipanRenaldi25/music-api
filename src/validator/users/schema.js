const Joi = require('joi');

// create user schema
const UserSchema = Joi.object({
    id: Joi.string().required();
    username: Joi.string().min(4).max(50).required(),
    password: Joi.string().min(8).required(),
    full_name: Joi.string().required()
})

module.exports = { UserSchema }