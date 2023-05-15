const albumSchema = require('./albumSchema');

class AlbumsValidator {
  static validateAlbumPayload(payload) {
    const validationResult = albumSchema.validate(payload);
    if (validationResult.error) {
      throw new Error(validationResult.error.message);
    }
  }
}

module.exports = AlbumsValidator;
