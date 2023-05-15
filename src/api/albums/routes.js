const albumsRouter = (handler) => [
  {
    method: 'GET',
    path: '/albums',
    handler: () => handler.getAllbumsHandler(),
  },
  {
    method: 'GET',
    path: '/albums',
    handler: (request, h) => handler.getAlbumById(),
  },
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbum(),
  },
];
