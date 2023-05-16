// Plugin for songs endpoint
const SongHandler = require('./handler');
const songRouter = require('./routes');

module.exports = {
  name: 'Songs',
  version: '1.0.0',
  register: (server, { services, validator }) => {
    const handler = new SongHandler(services, validator);
    server.route(songRouter(handler));
  },
};
