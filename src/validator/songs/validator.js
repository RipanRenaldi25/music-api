const InvariantError = require('../../exceptions/InvariantError');
const songSchema = require('./songSchema');

class SongValidator {
  static validateSongPayload(payload) {
    const validationResult = songSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = SongValidator;
