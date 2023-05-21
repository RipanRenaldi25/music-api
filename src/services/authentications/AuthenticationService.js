const { Pool } = require('pg');
const Jwt = require('@hapi/jwt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class AuthenticationService {
  constructor(userService, tokenManager) {
    this._pool = new Pool();
    this._userService = userService;
    this._tokenManger = tokenManager;
  }

  async verifyUser({ username, password }) {
    const id = await this._userService.login({ username, password });
    const refreshToken = await this._tokenManger.generateToken(
      { id },
      process.env.SECRET_REFRESH_TOKEN_KEY,
    );
    const accessToken = await this.generateToken({ id }, process.env.SECRET_ACCESS_TOKEN_KEY);
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [refreshToken],
    };
    const result = await this._userService.executeQuery(query.text, query.values);
    if (!result.rowCount) {
      throw new InvariantError('data yang dimasukkan tidak valid');
    }
    return accessToken;
  }
}

module.exports = AuthenticationService;
