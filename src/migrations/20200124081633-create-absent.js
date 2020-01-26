"use strict"
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("absents", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT
			},
			credential_id: {
				allowNull: false,
				type: Sequelize.BIGINT,
				references: {
					model: "credentials",
					key: "id"
				}
			},
			absent_time: {
				type: Sequelize.DATE
			},
			type: {
				type: Sequelize.INTEGER
			},
			createdBy: {
				type: Sequelize.STRING(50)
			},
			updatedBy: {
				type: Sequelize.STRING(50)
			},
			createdAt: {
				type: Sequelize.DATE
			},
			updatedAt: {
				type: Sequelize.DATE
			}
		})
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable("absents")
	}
}
