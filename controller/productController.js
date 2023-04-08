const BigPromise = require("../middleware/bigPromise")
const User = require("../model/user")
const CustomError = require("../utils/customError")
const crypto = require("crypto")

const mailHelper = require("../utils/emailHelper")
const fileUpload = require("express-fileupload")
const cloudinary = require("cloudinary").v2


exports.testProduct = BigPromise(async (req, res, next) => {
res.send("Hello")
})