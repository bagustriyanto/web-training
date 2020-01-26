"use strict"
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("class_schedules", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT
			},
			class_id: {
				type: Sequelize.BIGINT,
				references: {
					allowNull: false,
					model: "master_classes",
					key: "id"
				}
			},
			start_time: {
				type: Sequelize.DATE
			},
			end_time: {
				type: Sequelize.DATE
			},
			status: {
				type: Sequelize.BOOLEAN
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
		return queryInterface.dropTable("class_schedules")
	}
}
