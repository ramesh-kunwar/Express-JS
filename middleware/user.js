const User = require("../model/user")
const jwt = require("jsonwebtoken")
const BigPromise = require("../middleware/bigPromise")
const CustomError = require("../utils/customError")

exports.isLoggedIn = BigPromise(async (req, res, next) => {
    // grab a token
    const token = req.cookies.token || req.header("Authorization").replace("Bearer", "")

    if (!token) {
        return next(new CustomError("Login first to access this page", 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)

    next()

})

exports.customRole = (...roles) =>{

    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return next (new CustomError("You are not allowed for this resource",403))
        }
        next()
    }

    // old way of doing

    // if(req.user.role === "admin"){
    //     next()
    // }
}