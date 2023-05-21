const InvariantError = require('../../exceptions/InvariantError');
const playlistSchema = require('./schema');

const playlistValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = playlistSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = playlistValidator;
