'use strict';
module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: DataTypes.STRING//自分で定義した部分
  }, {
    underscored: true,
  });
  category.associate = function(models) {
    // associations can be defined here
  };
  return category;
};