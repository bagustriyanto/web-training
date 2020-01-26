"use strict"

module.exports = {
	up: (queryInterface, Sequelize) => {
		return Promise.all([
			queryInterface.addColumn("credentials", "last_login_ip", Sequelize.STRING, {
				after: "public_user"
			}),
			queryInterface.addColumn("credentials", "last_login", Sequelize.DATE, {
				after: "last_login_ip"
			})
		])
	},

	down: (queryInterface, Sequelize) => {
		return Promise.all([queryInterface.removeColumn("credentials", "last_login_ip"), queryInterface.removeColumn("credentials", "last_login")])
	}
}
