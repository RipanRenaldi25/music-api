const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class SongServices {
  constructor() {
    this._pool = new Pool();
  }

  async addSong() {

  }
}
