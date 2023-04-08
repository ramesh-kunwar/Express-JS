const BigPromise = require("../middleware/bigPromise")
const User = require("../model/user")
const CustomError = require("../utils/customError")
const crypto = require("crypto")

const mailHelper = require("../utils/emailHelper")
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
            token,
        }) // cookie may not be stored on mobile so for precaution send json
})


exports.login = BigPromise(async (req, res, next) => {
    const { email, password } = req.body;

    // check for presence of email and password
    if (!email || !password) {
        return next(new CustomError("Please provide email and password", 400))
    }

    const user = await User.findOne({ email }).select("+password"); // by default password is false in model so we have to make it true using +
    // check user
    if (!user) {
        return next(new CustomError("Email or password doesn't match or exist", 400))
    }

    const isPasswordCorrect = await user.isValidatedPassword(password);

    // if user doesn't match
    if (!isPasswordCorrect) {
        return next(new CustomError("Email or password doesn't match or exist", 400))
    }

    // generate and send token
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
            token
        }) // cookie may not be stored on mobile so for precaution send json


})


exports.logout = BigPromise(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "Logout success"
    })

})


exports.forgotPassword = BigPromise(async (req, res, next) => {

    const { email } = req.body;

    const user = await User.findOne({ email })

    if (!user) {
        return next(new CustomError("Email not found", 400))
    }

    const forgotToken = user.getForgotPasswordToken()

    await user.save({ validateBeforeSave: false })


    // craft a url
    const myUrl = `${req.protocol}://${req.get("host")}/password/reset/${forgotToken}`

    const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;

    try {
        await mailHelper({
            email: user.email,
            subject: "Tshirt store password reset email",
            message

        })

        res.status(200).json({
            success: true,
            message: "Email sent successfully"
        })

    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined
        await user.save({ validateBeforeSave: false })

        return next(new CustomError(error.message, 500))
    }

})
exports.passwordReset = BigPromise(async (req, res, next) => {

    const token = req.params.token;

    const encryToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
        encryToken,
        forgotPasswordExpiry: { $gt: Date.now() } // for time > now

    })

    if (!user) {
        return next(new CustomError("Token is invalid or expired", 400))
    }

    if (req.body.password != req.body.confirmPassword) {
        return next(new CustomError("password and confirm password do not match", 400))

    }

    user.password = req.body.password;

    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined

    await user.save()

    const tokenN = user.getJwtToken()
    const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }
    user.password = undefined

    return res.status(200).cookie('tokenN', tokenN, options)
        .json({
            success: true,
            data: user,
        }) // cookie may not be stored on mobile so for precaution send json
})


exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user,
    })
})


exports.changePassword = BigPromise(async (req, res, next) => {

    const userId = req.user.id;

    const user = await User.findById(userId).select("+password")

    const isCorrectOldPassword = await user.isValidatedPassword(req.body.oldPassword)

    if (!isCorrectOldPassword) {
        return next(new CustomError("Old password is incorrect", 400))
    }

    user.password = req.body.password;

    await user.save()

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
            token,
        }) // cookie may not be stored on mobile so for precaution send json

})

exports.updateUserDetails = BigPromise(async (req, res, next) => {

    const newData = {
        name: req.body.name,
        email: req.body.email
    }

    if (req.files) {
        const user = await User.findById(req.user.id)
        const imageId = user.photo.id

        // delete photo on cloudinary
        const resp = await cloudinary.uploader.destroy(imageId)

        // upload new photo
        console.log(req.files.photo);
        const result = await cloudinary.uploader.upload(req.files.photo.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        })

        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url,
        }
    }

    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
    })
})


exports.managerAllUser = BigPromise(async (req, res, next) => {

   const users = await User.find({role: "user"})

   res.status(200).json({
    count: users.length,
    success: true,
    users,

   })
})

exports.adminGetSingleUser = BigPromise(async (req, res, next) => {

   const users = await User.findById(req.params.id)

   if(!users){
    return next(new CustomError("NO user found", 400))
   }

   res.status(200).json({
    count: users.length,
    success: true,
    users
   })
})

exports.adminAllUser = BigPromise(async (req, res, next) => {

   const users = await User.find()

   res.status(200).json({
    count: users.length,
    success: true,
    users
   })
})

exports.adminUpdateOneUserDetails = BigPromise(async (req, res, next) => {

    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    

    const user = await User.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user,
    })
})

exports.adminDeleteOneuserDetails = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new CustomError("User doesn't exist", 401))
    }

    const imageId = user.photo.id;

   await cloudinary.uploader.destroy(imageId)

    user.deleteOne()

   res.status(200).json({
    success: true,
    message: "deleted"
   })
})