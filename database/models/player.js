'use strict';
module.exports = (sequelize, DataTypes) => {
  const player = sequelize.define('player', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    weight: DataTypes.STRING
  }, {});
  player.associate = function(models) {
    // associations can be defined here
  };
  return player;
};