class AlbumsHandler {
  constructor(services, validator) {
    this._services = services;
    this._validator = validator;
  }

  async getAlbumsHandler(request, h) {
    const albums = await this._services.getAlbums();
    const response = h.response({
      status: 'success',
      message: 'berhasil mendapatkan data',
      data: albums,
    });
    response.code(200);
    return response;
  }

  async getAlbumByIdHandler(request, h) {
    const { id } = request.params;
    const album = await this._services.getAlbumById(id);
    return album;
  }

  async postAlbumHandler(request, h) {
    const albumId = await this._services.postAlbum(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = AlbumsHandler;
