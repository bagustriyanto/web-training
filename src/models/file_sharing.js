'use strict';
module.exports = (sequelize, DataTypes) => {
  const file_sharing = sequelize.define('file_sharing', {
    class_id: DataTypes.BIGINT,
    credential_id: DataTypes.BIGINT,
    category_id: DataTypes.INTEGER,
    file_name: DataTypes.STRING,
    file_name_in_folder: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    updatedBy: DataTypes.STRING
  }, {});
  file_sharing.associate = function(models) {
    // associations can be defined here
  };
  return file_sharing;
};