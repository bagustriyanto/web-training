// Patches
const { inject, errorHandler } = require("express-custom-error")
inject() // Patch express in order to use async / await syntax

// Require Dependencies

const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const jwt = require("./util/jwt")
const path = require("path")
const swaggerUI = require("swagger-ui-express")
const swaggerDoc = require("./config/swagger.json")
const logger = require("./util/logger")
const session = require("express-session")
const env = process.env.NODE_ENV || "development"
const config = require("../config/config.json").token[env]

// Load .env Enviroment Variables to process.env

require("mandatoryenv").load(["DB_HOST", "DB_DATABASE", "DB_USER", "DB_PASSWORD", "PORT", "SECRET"])

const { PORT } = process.env

// Instantiate an Express Application
const app = express()

// configure express session
app.use(
	session({
		secret: config.secret,
		resave: false,
		saveUninitialized: true,
		cookie: {
			maxAge: 1800000
		}
	})
)

app.use(function(req, res, next) {
	if (!req.session.views) {
		req.session.views = {}
	}

	next()
})

// Configure Express App Instance
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Configure swagger-ui
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc))

// Configure custom logger middleware
app.use(logger.dev, logger.combined)

app.use(cookieParser())
app.use(cors())
app.use(helmet())

// Assign Routes
app.use("/", require("./routes/router.js"))

// Handle errors
app.use(errorHandler())

// Handle not valid route
app.use("*", (req, res) => {
	res.status(404).json({ status: false, message: "Endpoint Not Found" })
})

// Assign express-jwt
app.use(jwt())

global.appRoot = path.resolve(__dirname)

module.exports = app
