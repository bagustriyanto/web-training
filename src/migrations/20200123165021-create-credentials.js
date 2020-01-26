"use strict"
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("credentials", {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT
			},
			username: {
				allowNull: false,
				type: Sequelize.STRING(50)
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING
			},
			salt: {
				allowNull: false,
				type: Sequelize.STRING
			},
			status: {
				type: Sequelize.INTEGER(1)
			},
			public_user: {
				type: Sequelize.INTEGER(1)
			},
			verification_code: {
				type: Sequelize.STRING(8)
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
		return queryInterface.dropTable("credentials")
	}
}
