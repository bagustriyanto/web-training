"use strict"

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn("credentials", "email", Sequelize.STRING, {
			after: "username"
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn("credentials", "email")
	}
}
