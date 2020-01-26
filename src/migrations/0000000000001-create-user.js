const mysqlm = require("mysqlm")
const env = process.env.NODE_ENV || "development"
const sequelizeConfig = require("../config/config.json")[env]

const config = {
	host: sequelizeConfig.host,
	database: sequelizeConfig.database,
	user: sequelizeConfig.username,
	password: sequelizeConfig.password
}

async function up() {
	const { query } = mysqlm.connect(config)

	await query(`
    CREATE TABLE user(
        id INT PRIMARY KEY AUTO_INCREMENT,

        name VARCHAR(30) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `)
}

async function down() {
	const { query } = mysqlm.connect(config)

	await query(`DROP TABLE user`)
}

module.exports = { up, down }
