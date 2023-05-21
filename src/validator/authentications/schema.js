const Joi = require('joi');

// create authentication schema
const AuthenticationSchema = Joi.object({
  token: Joi.string().required(),
});

module.exports = { AuthenticationSchema };
