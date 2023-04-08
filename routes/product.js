const express = require("express");
const { isLoggedIn,customRole } = require("../middleware/user");
const { testProduct } = require("../controller/productController");
const router = express.Router()

router.route("/testproduct").get(testProduct)

module.exports = router;