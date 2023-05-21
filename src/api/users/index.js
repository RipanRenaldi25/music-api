const routes = require('./routes');
const UserHandler = require('./handler');

module.exports = {
  name: 'Users',
  version: '2.0.0',
  register: (server, { validator, userService }) => {
    const handler = new UserHandler(validator, userService);
    server.route(routes(handler));
  },
};
