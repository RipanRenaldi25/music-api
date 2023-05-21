const routes = require('./routes');
const Authenticationhandler = require('./handler');

module.exports = {
  name: 'authentication',
  version: '1.0.0',
  register: (server, { validator, authenticationService }) => {
    const handler = new Authenticationhandler(validator, authenticationService);
    server.route(routes(handler));
  },
};
