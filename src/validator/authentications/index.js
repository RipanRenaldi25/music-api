const InvariantError = require('../../exceptions/InvariantError');
const { AuthenticationSchema } = require('./schema');

const authenticationValidator = {
  validateAuthenticationPayload: (payload) => {
    const validationResult = AuthenticationSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError('Data tidak sesuai');
    }
  },
};

module.exports = authenticationValidator;
