const express = require("express")
const router = express.Router()

const absentController = require("./absentsController")

router.get("/api/absent", absentController.get)
router.get("/api/absent/history", absentController.getHistory)
router.post("/api/absent", absentController.validate, absentController.create)

module.exports = router
