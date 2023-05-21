const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { hash, compare } = require('bcrypt');
const Jwt = require('@hapi/jwt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class AuthenticationService {
  constructor(userService) {
    this._pool = new Pool();
    this._userService = userService;
  }

  async executeQuery(query, values) {
    const result = await this._pool.query(query, values);
    return result;
  }



module.exports = AuthenticationService;
