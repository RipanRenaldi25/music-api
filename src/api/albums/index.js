// Plugin for hapi server to manage /albums endpoint
const AlbumsHandler = require('./handlers');
const albumsRouter = require('./routes');

module.exports = {
  name: 'Albums',
  version: '1.0.0',
  register: (server, { services }) => {
    const handler = new AlbumsHandler(services, 0);
    server.route(albumsRouter(handler));
  },
};
