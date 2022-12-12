const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get("/ramesh", (req, res)=>{
  res.send("Hello Ramesh")
})
app.get("/features", (req, res)=>{
  res.send("This is a feature section")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})