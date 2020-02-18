const express = require("express")
const router = express.Router()

const masterClassController = require("./masterClassController")
const classController = require("./classController")

//master class
router.get("/api/master_class", masterClassController.getAll)
router.get("/api/master_class/:id", masterClassController.getById)
router.post("/api/master_class", masterClassController.validate("post"), masterClassController.create)
router.put("/api/master_class/:id", masterClassController.validate("put"), masterClassController.update)
router.delete("/api/master_class/:id", masterClassController.validate("delete"), masterClassController.delete)

//class schedule
router.get("/api/class", classController.getAll)
router.get("/api/class/:id", classController.getById)
router.post("/api/class", classController.validate("post"), classController.create)
router.put("/api/class/:id", classController.validate("put"), classController.update)
router.delete("/api/class/:id", classController.validate("delete"), classController.delete)

module.exports = router
