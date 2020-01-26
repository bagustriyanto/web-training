"use strict"
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("profiles", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			credential_id: {
				type: Sequelize.BIGINT,
				references: {
					allowNull: false,
					model: "credentials",
					key: "id"
				}
			},
			full_name: {
				type: Sequelize.STRING(50)
			},
			phone: {
				type: Sequelize.STRING(20)
			},
			address: {
				type: Sequelize.STRING(100)
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
		return queryInterface.dropTable("profiles")
	}
}
