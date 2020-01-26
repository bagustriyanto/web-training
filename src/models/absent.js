"use strict"
module.exports = (sequelize, DataTypes) => {
	const absent = sequelize.define(
		"absent",
		{
			id: DataTypes.BIGINT,
			credential_id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				references: {
					model: "credentials",
					key: "id"
				}
			},
			absent_time: DataTypes.DATE,
			type: DataTypes.INTEGER,
			createdBy: DataTypes.STRING,
			updatedBy: DataTypes.STRING
		},
		{}
	)
	absent.associate = function(models) {
		// associations can be defined here
	}
	return absent
}
