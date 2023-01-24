const express = require("express");
const serversConrtoller = require("../controllers/servers.controller.js");
const validateCreateServerInputs = require("../middlewares/validateCreateServerInputs.middleware");
const valdiateIdParam = require("../middlewares/validateIdParam.middleware.js");
const router = express.Router();

router.use("/:id", valdiateIdParam);
router.delete("/:id", serversConrtoller.del);
router.patch("/:id", serversConrtoller.update);

router.get("/", serversConrtoller.get);

router.use("/", validateCreateServerInputs);
router.post("/", serversConrtoller.create);

module.exports = router;
