const router = require("express").Router()
const status = require("http-status")

// Users routes
// router.use(require("./user"))
router.use("/", function(req, res, next) {
	if (Object.keys(req.session.views).length === 0 && (!req.url.includes("login") || !req.url.includes("login"))) {
		res.status(status.UNAUTHORIZED).json({ message: "Unauthorized. please re-login" })
	}
	next()
})
router.use(require("../modules/classes/classApi"))
router.use(require("../modules/auth/authApi"))

module.exports = router
