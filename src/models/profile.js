"use strict"
module.exports = (sequelize, DataTypes) => {
	const profile = sequelize.define(
		"profile",
		{
			credential_id: {
				allowNull: false,
				type: DataTypes.BIGINT,
				references: {
					model: "credentials",
					key: "id"
				}
			},
			full_name: DataTypes.STRING,
			phone: DataTypes.STRING,
			address: DataTypes.STRING,
			createdBy: DataTypes.STRING,
			updatedBy: DataTypes.STRING
		},
		{}
	)
	profile.associate = function(models) {
		// associations can be defined here
	}
	return profile
}
