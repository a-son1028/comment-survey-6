var express = require("express");
var router = express.Router();
import Models from "../models";

import Middlewares from "../middlewares";

/* GET users listing. */
router.get("/info", [Middlewares.Auth.isUser], async function(req, res, next) {
  const user = req.user
  res.json(user);
});

module.exports = router;
