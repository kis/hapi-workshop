'use strict';
module.exports = (sequelize, DataTypes) => {
  const player = sequelize.define('player', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    weight: DataTypes.STRING
  }, {});
  player.associate = function(models) {
    // associations can be defined here
    player.hasMany(models.Post, {
      foreignKey: 'userId',
      as: 'posts',
      onDelete: 'CASCADE',
    });

    player.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comments',
      onDelete: 'CASCADE',
    });
  };
  return player;
};