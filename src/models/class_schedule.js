"use strict"
module.exports = (sequelize, DataTypes) => {
	const class_schedule = sequelize.define(
		"class_schedule",
		{
			class_id: { type: DataTypes.BIGINT, references: { model: "master_class", key: "id" } },
			start_time: DataTypes.DATE,
			end_time: DataTypes.DATE,
			status: DataTypes.BOOLEAN,
			createdBy: DataTypes.STRING,
			updatedBy: DataTypes.STRING
		},
		{}
	)
	class_schedule.associate = function(models) {
		// associations can be defined here
	}
	return class_schedule
}
