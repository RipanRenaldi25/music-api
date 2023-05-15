require('dotenv').config();
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = await Hapi.server({
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  await server.start();
  console.log(`Server Running on ${server.info.uri}`);
};

init();
