const ClientError = require('../../exceptions/ClientError');

class UsersHandler {
  constructor(validator, userService) {
    this._validator = validator;
    this._userService = userService;
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const { username, password, fullname } = request.payload;
      const userId = await this._userService.registerUser({
        username,
        password,
        fullname,
      });
      const response = h.response({
        status: 'success',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (e) {
      if (e instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: e.message,
        }).code(e.statusCode);
      }
      return h.response({
        status: 'error',
        message: 'server error',
      }).code(500);
    }
  }
}

module.exports = UsersHandler;
