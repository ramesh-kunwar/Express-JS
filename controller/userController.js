const BigPromise = require("../middleware/bigPromise")
const User = require("../model/user")
const CustomError = require("../utils/customError")

exports.signup = BigPromise(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
        return next(new CustomError("Name, email and password are required", 400))
    }

    const user = await User.create({
        name,
        email,
        password
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