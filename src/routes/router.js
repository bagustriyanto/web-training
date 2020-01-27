const router = require("express").Router()

// Users routes

router.use(require("./user"))
router.use(require("../modules/auth/authApi"))

module.exports = router
