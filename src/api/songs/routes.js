const routes = (handlers) => ([
  {
    method: 'GET',
    path: '/songs',
    handler: (request, h) => handlers.getSongsHandler(request, h),
  },
  {
    method: 'POST',
    path: '/songs',
    handler: (request, h) => handlers.postSongHandler(request, h),
  },
]);

module.exports = routes;
