const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

// Create all Logic
class AlbumServices {
  constructor() {
    this._pool = new Pool();
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT * FROM albums WHERE id=$1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan, ID yang dicari tidak ada');
    }
    return result.rows[0];
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM albums JOIN songs on albums.id=songs.album_id WHERE albums.id=$1',
      values: [albumId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async postAlbum({ name, year }) {
    const albumId = `album-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [albumId, name, year],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Album gagal ditambahkan');
    }
    return result.rows[0].id;
  }

  async deleteAlbum(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id=$1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Tidak dapat menemukan id yang dicari');
    }
  }

  async editAlbum(id, { name, year }) {
    const query = {
      text: 'UPDATE albums SET name=$1, year=$2 WHERE id=$3 RETURNING id',
      values: [name, year, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Album gagal diperbarui. Tidak dapat menemukan id yang dicari');
    }
  }
}

module.exports = AlbumServices;
