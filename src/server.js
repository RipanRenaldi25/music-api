require('dotenv').config();
const Hapi = require('@hapi/hapi');
const albumPlugin = require('./api/albums');
const AlbumServices = require('./services/albums/albumsServices');
const AlbumValidator = require('./validator/albums/validator');

const init = async () => {
  const albumServices = new AlbumServices();
  const server = await Hapi.server({
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
  ]);
  await server.start();
  console.log(`Server Running on ${server.info.uri}`);
};

init();
