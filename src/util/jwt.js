const expressJwt = require("express-jwt")
const env = process.env.NODE_ENV || "development"
const config = require("../config/config.json").token[env]

function jwt() {
	return expressJwt({
		secret: config.secret,
		audience: config.audience,
		issuer: config.issuer
	}).unless({
		path: ["/api/login", "/api/register", "/api/verification"]
	})
}

module.exports = jwt
