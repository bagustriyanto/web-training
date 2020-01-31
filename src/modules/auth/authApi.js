const express = require("express")
const router = express.Router()
const authController = require("../auth/authController")

router.post("/api/login", authController.login)
router.post("/api/register", authController.register)
router.post("/api/verification", authController.verification)

module.exports = router
