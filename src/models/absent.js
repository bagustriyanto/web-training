"use strict"
module.exports = (sequelize, DataTypes) => {
	const absent = sequelize.define(
		"absent",
		{
			credential_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				references: {
					model: "credentials",
					key: "id"
				}
			},
			schedule_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				references: {
					model: "class_schedule",
					key: "id"
				}
			},
			absent_time: DataTypes.DATE,
			createdBy: DataTypes.STRING,
			updatedBy: DataTypes.STRING
		},
		{}
	)
	absent.associate = function(models) {
		// associations can be defined here
		absent.belongsTo(models.class_schedule, {
			foreignKey: "schedule_id"
		})
	}
	return absent
}
