const express = require("express")
const router = express.Router()

const masterClassController = require("./masterClassController")

router.get("/api/master_class", masterClassController.getAll)
router.get("/api/master_class/:id", masterClassController.getById)
router.post("/api/master_class", masterClassController.validate("post"), masterClassController.create)
router.put("/api/master_class/:id", masterClassController.validate("put"), masterClassController.update)
router.delete("/api/master_class/:id", masterClassController.validate("delete"), masterClassController.delete)
module.exports = router
