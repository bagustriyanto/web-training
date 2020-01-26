"use strict"
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("file_sharings", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT
			},
			class_id: {
				type: Sequelize.BIGINT
			},
			credential_id: {
				type: Sequelize.BIGINT
			},
			category_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "categories",
					key: "id"
				}
			},
			file_name: {
				type: Sequelize.STRING(255)
			},
			file_name_in_folder: {
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
		return queryInterface.dropTable("file_sharings")
	}
}
