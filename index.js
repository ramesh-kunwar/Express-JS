const app = require("./app")
const connectWithDb = require("./config/db")


// connect with database
connectWithDb()




app.listen(process.env.PORT, ()=> console.log(`App is running at port ${process.env.PORT}`))