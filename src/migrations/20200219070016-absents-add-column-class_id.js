"use strict"

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn("absents", "schedule_id", Sequelize.BIGINT, {
			after: "credential_id"
		})
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn("absents", "schedule_id")
	}
}
