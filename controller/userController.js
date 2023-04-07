const BigPromise = require("../middleware/bigPromise")
const User = require("../model/user")
const CustomError = require("../utils/customError")

const fileUpload = require("express-fileupload")
const cloudinary = require("cloudinary").v2


exports.signup = BigPromise(async (req, res, next) => {

    // if file  / photo not found
    if (!req.files) {
        return next(new CustomError("Phoso is required for signup", 400))
    }

    // if file found
    let file = req.files.photo;
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale"
    })


    const { name, email, password } = req.body;

    if (!email || !name || !password) {
        return next(new CustomError("Name, email and password are required", 400))
    }

    const user = await User.create({
        name,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    })

    const token = user.getJwtToken()
    const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }
    user.password = undefined

    return res.status(200).cookie('token', token, options)
        .json({
            success: true,
            data: user,
        }) // cookie may not be stored on mobile so for precaution send json
})