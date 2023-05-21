require('dotenv').config();
const Hapi = require('@hapi/hapi');

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

const init = async () => {
  const albumServices = new AlbumServices();
  const songServices = new SongServices();
  const userService = new UserService();
  const server = Hapi.server({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
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
