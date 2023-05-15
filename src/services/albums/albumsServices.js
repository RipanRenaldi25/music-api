const { Pool } = require('pg');

class AlbumServices {
  constructor() {
    this._pool = new Pool();
  }
}

module.exports = AlbumServices;
