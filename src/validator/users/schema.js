const Joi = require('joi');

// create user schema
const UserSchema = Joi.object({
  username: Joi.string().min(4).max(255).required(),
  password: Joi.string().min(6).required(),
  fullname: Joi.string().required(),
});

module.exports = { UserSchema };
