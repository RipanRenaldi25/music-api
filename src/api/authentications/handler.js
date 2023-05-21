const ClientError = require('../../exceptions/ClientError');

class AuthenticationsHandler {
  constructor(validator, authenticationService) {
    this._validator = validator;
    this._authenticationService = authenticationService;
  }

  async postAuthenticationHandler(request, h) {
    try {
      this._validator.validatePostAuthenticationPayload(request.payload);
      const { username, password } = request.payload;
      const [accessToken, refreshToken] = await this._authenticationService.verifyUser({
        username,
        password,
      });
      const response = h.response({
        status: 'success',
        data: {
          accessToken,
          refreshToken,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(error.statusCode);
      }
      return h.response({
        status: 'error',
        message: error.message,
      }).code(500);
    }
  }
}

module.exports = AuthenticationsHandler;
