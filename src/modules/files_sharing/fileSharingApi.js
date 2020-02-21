const express = require("express")
const router = express.Router()

const fileController = require("./fileSharingController")

router.get("/api/file", fileController.validate(), fileController.getFiles)
router.get("/api/file/download/:id", fileController.validate("download"), fileController.downloadFile)
router.post("/api/file", fileController.uploadFile)
router.delete("/api/file/:id", fileController.validate("delete"), fileController.deleteFile)

module.exports = router
