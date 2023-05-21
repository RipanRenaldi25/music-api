const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async executeQuery(query, values = []) {
    const result = await this._pool.query(query, values);
    return result;
  }

  async createPlaylist({ name, owner }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlists(id, name, username) VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this.executeQuery(query.text, query.values);
    if (!result.rowCount) {
      throw new InvariantError('Data tidak valid');
    }
    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE username=$1',
      values: [owner],
    };
    const result = await this.executeQuery(query.text, query.values);
    if (!result.rowCount) {
      throw new AuthenticationError('credential tidak valid');
    }
    return result.rows;
  }

  async verifyPlaylistAccess(owner, playlistId) {
    await this.isPlaylistExist(playlistId);
    const query = {
      text: 'SELECT * FROM playlists WHERE username=$1 and id=$2',
      values: [owner, playlistId],
    };
    const result = await this.executeQuery(query.text, query.values);
    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async deletePlaylist(owner, playlistId) {
    await this.verifyPlaylistAccess(owner, playlistId);
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1',
      values: [playlistId],
    };
    const result = await this.executeQuery(query.text, query.values);
    if (!result.rowCount) {
      throw new InvariantError('Gagal menghapus playlist');
    }
  }

  async isPlaylistExist(playlistId) {
    const query = {
      text: 'SELECT * FROM playlists where id = $1',
      values: [playlistId],
    };
    const result = await this.executeQuery(query.text, query.values);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist tidak ada');
    }
  }
}

module.exports = PlaylistsService;
