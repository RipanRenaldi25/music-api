const { Pool } = require('pg');
const Jwt = require('@hapi/jwt');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationService {
  constructor(userService, tokenManager) {
    this._pool = new Pool();
    this._userService = userService;
    this._tokenManager = tokenManager;
  }

  async verifyUser({ username, password }) {
    const id = await this._userService.login({ username, password });
    const refreshToken = await this._tokenManager.generateToken(
      { id, username },
      process.env.SECRET_REFRESH_TOKEN_KEY,
    );
    const accessToken = await this._tokenManager.generateToken(
      { id, username },
      process.env.SECRET_ACCESS_TOKEN_KEY,
    );
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [refreshToken],
    };
    const result = await this._userService.executeQuery(query.text, query.values);
    if (!result.rowCount) {
      throw new InvariantError('data yang dimasukkan tidak valid');
    }
    return [accessToken, refreshToken];
  }

  async verifyRefreshToken(refreshToken) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token=$1',
      values: [refreshToken],
    };
    const resultQuery = await this._userService.executeQuery(query.text, query.values);
    if (!resultQuery.rowCount) {
      throw new InvariantError('Refresh token tidak valid (db)');
    }
  }

  async updateAccessToken(refreshToken) {
    await this.verifyRefreshToken(refreshToken);
    const { id, username } = this._tokenManager.verifySignatureOfToken(refreshToken);
    const newAccessToken = this._tokenManager.generateToken(
      { id, username },
      process.env.SECRET_ACCESS_TOKEN_KEY,
    );
    return newAccessToken;
  }

  async deleteRefreshToken(refreshToken) {
    await this.verifyRefreshToken(refreshToken);
    this._tokenManager.verifySignatureOfToken(refreshToken);
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [refreshToken],
    };
    const result = await this._userService.executeQuery(query.text, query.values);
    if (!result.rowCount) {
      throw new InvariantError('Data tidak valid');
    }
  }
}

module.exports = AuthenticationService;
