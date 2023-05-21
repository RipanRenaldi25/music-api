require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// Albums
const albumPlugin = require('./api/albums');
const AlbumServices = require('./services/albums/albumsServices');
const AlbumValidator = require('./validator/albums/validator');

// Songs
const SongPlugin = require('./api/songs');
const SongServices = require('./services/songs/SongServices');
const SongValidator = require('./validator/songs/validator');

// users
const usersPlugin = require('./api/users');
const userValidator = require('./validator/users');
const UserService = require('./services/users/UsersService');

// authentications
const authenticationPlugin = require('./api/authentications');
const authenticationValidator = require('./validator/authentications');
const AuthenticationService = require('./services/authentications/AuthenticationService');
const TokenManager = require('./token/TokenManager');

// playlists
const playlistPlugin = require('./api/playlists');
const PlaylistService = require('./services/playlists/PlaylistsService');
const playlistValidator = require('./validator/playlists');

// Playlist Song
const playlistSongPlugin = require('./api/PlaylistSong');
const PlaylistSongService = require('./services/PlaylistSong/PlaylistSongService');
const playlistSongValidator = require('./validator/PlaylistSong');

const init = async () => {
  const albumServices = new AlbumServices();
  const songServices = new SongServices();
  const userService = new UserService();
  const authenticationService = new AuthenticationService(userService, TokenManager);
  const playlistService = new PlaylistService();
  const playlistSongService = new PlaylistSongService(songServices);
  const server = Hapi.server({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // try [] instead
  await server.register(Jwt);

  // create auth strategies
  server.auth.strategy('music_jwt', 'jwt', {
    keys: process.env.SECRET_ACCESS_TOKEN_KEY,
    verify: {
      sub: false,
      iss: false,
      aud: false,
      maxAgeSec: 360000,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        username: artifacts.decoded.payload.username,
      },
    }),
  });

  await server.register([
    {
      plugin: albumPlugin,
      options: {
        services: albumServices,
        validator: AlbumValidator,
      },
    },
    {
      plugin: SongPlugin,
      options: {
        services: songServices,
        validator: SongValidator,
      },
    },
    {
      plugin: usersPlugin,
      options: {
        validator: userValidator,
        userService,
      },
    },
    {
      plugin: authenticationPlugin,
      options: {
        validator: authenticationValidator,
        authenticationService,
      },
    },
    {
      plugin: playlistPlugin,
      options: {
        validator: playlistValidator,
        playlistService,
      },
    },
    {
      plugin: playlistSongPlugin,
      options: {
        validator: playlistSongValidator,
        playlistSongService,
        playlistService,
        songService: songServices,
      },

    },
  ]);
  server.route({
    method: '*',
    path: '/{any*}',
    handler: (request, h) => h.response({
      status: 'fail',
      message: 'Tidak dapat menemukan halaman yang dicari',
    }).code(404),
  });
  await server.start();
  console.log(`Server Running on ${server.info.uri}`);
};

init();
