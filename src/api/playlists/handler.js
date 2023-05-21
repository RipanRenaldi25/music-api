const ClientError = require('../../exceptions/ClientError');

class PlaylistHandler {
  constructor(validator, playlistService) {
    this._validator = validator;
    this._playlistService = playlistService;
  }

  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { username } = request.auth.credentials;
      const playlistId = await this._playlistService.createPlaylist({ name, owner: username });
      const response = h.response({
        status: 'success',
        data: {
          playlistId,
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
        message: error.message,
      }).code(500);
    }
  }

  async getPlaylistsHandler(request, h) {
    try {
      const { username } = request.auth.credentials;
      const playlists = await this._playlistService.getPlaylists(username);
      const response = h.response({
        status: 'success',
        data: {
          playlists,
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
        message: error.message,
      }).code(500);
    }
  }

  async deletePlaylistHandler(request, h) {
    try {
      const { username } = request.auth.credentials;
      const { id } = request.params;
      await this._playlistService.deletePlaylist(username, id);
      const response = h.response({
        status: 'success',
        message: 'Berhasil menghapus data',
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
        message: error.message,
      }).code(500);
    }
  }
}

module.exports = PlaylistHandler;
