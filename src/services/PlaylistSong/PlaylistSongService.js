const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongService {
  constructor() {
    this._pool = new Pool();
  }

  async executeQuery(query, values) {
    const result = await this._pool.query(query, values);
    return result;
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO playlist_songs(id, id_song, id_playlist) VALUES($1, $2, $3)',
      values: [id, songId, playlistId],
    };
    const result = await this.executeQuery(query.text, query.values);
    if (result.rowCount) {
      throw new InvariantError('Data tidak valid');
    }
  }
}
