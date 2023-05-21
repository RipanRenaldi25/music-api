const InvariantError = require('../../exceptions/InvariantError');
const { UserSchema } = require('./schema');

const userValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError('Data tidak valid');
    }
  },
};

module.exports = userValidator;
