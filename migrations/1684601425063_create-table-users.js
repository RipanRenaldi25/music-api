/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(255)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    password: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    full_name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
  });

  // make username unique
  pgm.addConstraint('users', 'unique_username', 'UNIQUE(username)');
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
