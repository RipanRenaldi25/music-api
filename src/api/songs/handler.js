const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;
  }

  async getSongsHandler(request, h) {
    try {
      const songs = await this._services.getSongs();
      const response = h.response({
        status: 'success',
        data: {
          songs,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      return h.response({
        status: 'error',
        message: 'Sistem sedang mengalami kendala',
      }).code(500);
    }
  }

  async postSongHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const songId = await this._services.addSong(request.payload);
      const response = h.response({
        status: 'success',
        data: {
          songId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      return h.response({
        status: 'error',
        message: 'Sistem sedang mengalami kendala',
      }).code(500);
    }
  }
}

module.exports = SongsHandler;
