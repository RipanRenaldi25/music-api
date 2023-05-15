class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.name = 'Client Error';
  }
}

module.exports = ClientError;
