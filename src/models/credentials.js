"use strict"
module.exports = (sequelize, DataTypes) => {
	const credentials = sequelize.define(
		"credentials",
		{
			id: DataTypes.BIGINT,
			username: DataTypes.STRING,
			password: DataTypes.STRING,
			salt: DataTypes.STRING,
			status: DataTypes.INTEGER,
			public_user: DataTypes.INTEGER,
			verification_code: DataTypes.STRING,
			last_login_ip: DataTypes.STRING,
			last_login: DataTypes.DATE,
			createdBy: DataTypes.STRING,
			updatedBy: DataTypes.STRING
		},
		{}
	)
	credentials.associate = function(models) {
		// associations can be defined here
	}
	return credentials
}
