const express = require("express")
const router = express.Router()
const authController = require("../auth/authController")

router.post("/api/login", authController.login)
router.get("/api/register", authController.register)
router.get("/api/testResponse", authController.testResponse)

module.exports = router
