"use strict"
module.exports = (sequelize, DataTypes) => {
	const session = sequelize.define(
		"session",
		{
			sid: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true
			},
			userId: DataTypes.STRING,
			expires: DataTypes.DATE,
			data: DataTypes.STRING(50000)
		},
		{}
	)
	session.associate = function(models) {
		// associations can be defined here
	}
	return session
}
