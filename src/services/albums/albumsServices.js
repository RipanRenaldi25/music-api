const { Pool } = require('pg');
const { nanoid } = require('nanoid');

// Create all Logic
class AlbumServices {
  constructor() {
    this._pool = new Pool();
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT (id, name, year) FROM albums');
    return result.rows;
  }

  async getAlbumById(id) {
    const query = {
      text: 'SELECT (id, name, year) FROM albums WHERE id=$1 RETURNING id',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error('Album tidak ditemukan, ID yang dicari tidak ada');
    }
    return result.rows[0];
  }

  async postAlbum({ name, year }) {
    try {
      const albumId = `album-${nanoid(16)}`;
      const query = {
        text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
        values: [albumId, name, year],
      };
      const result = await this._pool.query(query);
      if (!result.rows.length) {
        throw new Error('Insert data gagal');
      }
      return result.rows[0].id;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = AlbumServices;
