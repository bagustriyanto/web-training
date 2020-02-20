"use strict"

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn("absents", "type")
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.addColumn("absents", "type", Sequelize.INTEGER, {
			after: "absent_time"
		})
	}
}
