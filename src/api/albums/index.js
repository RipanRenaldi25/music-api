// Plugin for hapi server to manage /albums endpoint
const AlbumsHandler = require('./handlers');
const albumsRouter = require('./routes');

module.exports = {
  name: 'Albums',
  version: '1.0.0',
  register: (server, { services, validator }) => {
    const handler = new AlbumsHandler(services, validator);
    server.route(albumsRouter(handler));
  },
};
