const routes = require('./routes');
const PlaylistHandler = require('./handler');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: (server, { validator, playlistService }) => {
    const handler = new PlaylistHandler(validator, playlistService);
    server.route(routes(handler));
  },
};
