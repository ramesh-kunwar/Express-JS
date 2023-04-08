require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload")


const app = express()

// regular middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//cookies and file middleware
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

// temp check
app.set("view engine", "ejs")

// morgan middleware
app.use(morgan('tiny'))


// import all routes here
const home = require("./routes/home")
const user = require("./routes/user")
const product = require("./routes/product")


// router middleware
app.use("/api/v1", home)
app.use("/api/v1", user)
app.use("/api/v1", product)


app.get("/signuptest", (req, res) => {
    res.render("signuptest")
})



module.exports = app;