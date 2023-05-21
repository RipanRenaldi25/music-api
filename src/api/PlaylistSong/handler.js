const ClientError = require('../../exceptions/ClientError');

class PlaylistSongHandler {
  constructor(validator, playlistSongService, playlistService, songService) {
    this._validator = validator;
    this._playlistSongService = playlistSongService;
    this._playlistService = playlistService;
    this._songService = songService;
  }

  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { songId } = request.payload;
      const { id: playlistId } = request.params;
      const { id: ownerId, username } = request.auth.credentials;
      await this._songService.isSongExist(songId);
      await this._playlistService.verifyPlaylistAccess(username, playlistId);
      await this._playlistSongService.addSongToPlaylist(playlistId, songId);
      const response = h.response({
        status: 'success',
        message: `Berhasil menambahkan lagu ke playlist ${playlistId}`,
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
      });
    }
  }

  async getPlaylistSongsHandler(request, h) {
    try {
      const { username } = request.auth.credentials;
      const { id: playlistId } = request.params;
      await this._playlistService.verifyPlaylistAccess(username, playlistId);
      const playlistSongs = await this._playlistSongService.getSongsFromPlaylist(
        playlistId,
        username,
      );
      const response = h.response({
        status: 'success',
        data: {
          playlist: {
            ...playlistSongs,
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
        message: error.message,
      });
    }
  }

  async deletePlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { songId } = request.payload;
      const { id: playlistId } = request.params;
      const { id: credentialId, username } = request.auth.credentials;
      await this._playlistService.verifyPlaylistAccess(username, playlistId);
      await this._playlistSongService.deleteSongFromPlaylist(playlistId, songId);
      return {
        status: 'success',
        message: 'Berhasil menghapus data',
      };
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
      });
    }
  }
}

module.exports = PlaylistSongHandler;
