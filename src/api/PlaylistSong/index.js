const routes = require('./routes');
const PlaylistSongHandler = require('./handler');

module.exports = {
  name: 'Playlist Song',
  version: '1.0.0',
  register: (server, {
    validator, playlistSongService, playlistService, songService,
  }) => {
    const handler = new PlaylistSongHandler(
      validator,
      playlistSongService,
      playlistService,
      songService,
    );
    server.route(routes(handler));
  },
};
