const Joi = require('joi');

// create authentication schema
const PutAuthenticationSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const PostAuthenticationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { PutAuthenticationSchema, PostAuthenticationSchema };
