const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { compare, hash } = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async executeQuery(query, values) {
    const queryResult = await this._pool.query(query, values);
    return queryResult;
  }

  async isUsernameExist(username) {
    const query = {
      text: 'SELECT id, username FROM users WHERE username = $1',
      values: [username],
    };
    const queryResult = await this.executeQuery(query.text, query.values);
    // 1 if user is exist, it mean return true if user exist
    return queryResult.rowCount > 0;
  }

  async getUserByUsername(username) {
    const query = {
      text: 'SELECT id, username FROM users WHERE username = $1',
      values: [username],
    };
    const queryResult = await this.executeQuery(query.text, query.values);
    return queryResult.rows;
  }

  async checkUsername(username) {
    const isUsernameExist = await this.isUsernameExist(username);
    if (isUsernameExist) {
      throw new InvariantError('Username sudah digunakan');
    }
  }

  async isPasswordValid(password, passwordHashed) {
    const validPassword = await compare(password, passwordHashed);
    if (!validPassword) {
      throw new AuthenticationError('Kredendsial yang anda berikan salah');
    }
  }

  async registerUser({ username, password, fullName }) {
    const id = `user-${nanoid(16)}`;
    await this.checkUsername(username);
    const hasedPassword = await hash(password, 10);

    // register user
    const query = {
      text: 'INSERT INTO users(id, username, password, full_name) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hasedPassword, fullName],
    };
    const queryResult = this.executeQuery(query.text, query.values);
    if (!queryResult.rowCount) {
      throw new InvariantError('Data tidak valid');
    }
    return queryResult.rows[0].id;
  }

  async login({ username, password }) {
    const user = await this._userService.getUserByUsername(username);
    if (user.length === 0) {
      throw new AuthenticationError('Kredensial yang anda berikan salah');
    }
    const isUserValid = await this.isPasswordValid(password, user.password);
    if (!isUserValid) {
      throw new AuthenticationError('Kredensial yang anda berikan salah');
    }
  }
}

module.exports = UsersService;