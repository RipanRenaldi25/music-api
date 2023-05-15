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
}

module.exports = AlbumServices;
