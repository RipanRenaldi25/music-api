const albumsRouter = (handler) => [
  {
    method: 'GET',
    path: '/albums',
    handler: (request, h) => handler.getAlbumsHandler(request, h),
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: (request, h) => handler.getAlbumByIdHandler(request, h),
  },
  {
    method: 'POST',
    path: '/albums',
    handler: (request, h) => handler.postAlbumHandler(request, h),
  },
];

module.exports = albumsRouter;
