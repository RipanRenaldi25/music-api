const albumSchema = require('./albumSchema');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumsValidator {
  static validateAlbumPayload(payload) {
    const validationResult = albumSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
}

module.exports = AlbumsValidator;
