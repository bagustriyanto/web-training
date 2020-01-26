"use strict"
module.exports = (sequelize, DataTypes) => {
	const master_class = sequelize.define(
		"master_class",
		{
			class_name: DataTypes.STRING,
			class_code: DataTypes.STRING,
			status: DataTypes.BOOLEAN,
			createdBy: DataTypes.STRING,
			updatedBy: DataTypes.STRING
		},
		{}
	)
	master_class.associate = function(models) {
		// associations can be defined here
	}
	return master_class
}
