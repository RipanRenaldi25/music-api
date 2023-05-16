const ClientError = require('../../exceptions/ClientError');

class AlbumsHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;
  }

  async getAlbumsHandler(request, h) {
    const albums = await this._services.getAlbums();
    const response = h.response({
      status: 'success',
      message: 'berhasil mendapatkan data',
      data: albums,
    });
    response.code(200);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._services.getAlbumById(id);
      const songs = await this._services.getSongsByAlbumId(id);
      const response = h.response({
        status: 'success',
        data: {
          album: {
            ...album,
            songs,
          },
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

  async postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const albumId = await this._services.postAlbum(request.payload);
      const response = h.response({
        status: 'success',
        data: {
          albumId,
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

  async deleteAlbumHandler(request, h) {
    try {
      const { id } = request.params;
      await this._services.deleteAlbum(id);
      const response = h.response({
        status: 'success',
        message: 'Album berhasil dihapus',
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

  async putAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);
      const { id } = request.params;
      await this._services.editAlbum(id, { ...request.payload });
      const response = h.response({
        status: 'success',
        message: 'Album berhasil diperbaharui',
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
}

module.exports = AlbumsHandler;
