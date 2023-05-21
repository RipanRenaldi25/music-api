const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistSongService {
  constructor(songService) {
    this._pool = new Pool();
    this._songService = songService;
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
    if (!result.rowCount) {
      throw new InvariantError('Data tidak valid');
    }
  }

  async getSongsFromPlaylist(playlistId, owner) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, playlists.username FROM playlists INNER JOIN playlist_songs ON playlists.id = playlist_songs.id_playlist WHERE playlists.id = $1',
      values: [playlistId],
    };
    const songsInPlaylist = await this._songService.getSongByPlaylistId(playlistId);
    const result = await this.executeQuery(query.text, query.values);
    if (!result.rowCount) {
      throw new NotFoundError('Playlist id tidak ditemukan');
    }
    return {
      ...result.rows[0],
      songs: [...songsInPlaylist],
    };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE id_song = $1',
      values: [songId],
    };
    const result = await this.executeQuery(query.text, query.values);
    if (!result.rowCount) {
      throw new InvariantError('Song id tidak ditemukan');
    }
  }
}

module.exports = PlaylistSongService;
