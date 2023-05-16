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

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const song = await this._services.getSongById(id);
      const response = h.response({
        status: 'success',
        data: {
          song,
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
    }
  }

  async putSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      await this._services.editSongById(id, request.payload);
      const response = h.response({
        status: 'success',
        message: 'Berhasil memperbaharui lagu',
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
        message: 'Server sedang mengalami kendala',
      }).code(500);
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;
      await this._services.deleteSongById(id);
      const response = h.response({
        status: 'success',
        message: 'Berhasil menghapus lagu',
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
        message: 'Server sedang mengalami kendala',
      }).code(500);
    }
  }
}

module.exports = SongsHandler;
