const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

class TokenManager {
  static generateToken(payload, secretToken) {
    return Jwt.token.generate(payload, secretToken);
  }

  // check if refresh token is valid credential
  static verifySignatureOfToken(refreshToken) {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, refreshToken);
      return artifacts.decoded.payload;
    } catch (error) {
      throw new InvariantError('Refresh Token tidak valid');
    }
  }
}

module.exports = TokenManager;
