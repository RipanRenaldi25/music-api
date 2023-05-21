/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(255)',
      primaryKey: true,
    },
    id_song: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    id_playlist: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
  });
  pgm.addConstraint('playlist_songs', 'fk_id_song_from_songs', 'FOREIGN KEY(id_song) REFERENCES songs(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'fk_id_playlist_from_playlists', 'FOREIGN KEY(id_playlist) REFERENCES playlists(id) ON DELETE CASCADE');
  pgm.addConstraint('playlist_songs', 'unique_id_song_id_playlist', 'UNIQUE(id_song, id_playlist)');
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_songs');
};
