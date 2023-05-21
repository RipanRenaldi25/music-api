/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('playlists', {
    id: {
      type: 'VARCHAR(255)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    username: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
  });
  pgm.addConstraint('playlists', 'fk_username_from_users', 'FOREIGN KEY(username) REFERENCES users(username) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('playlists');
};
