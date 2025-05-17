require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require("path");
const routes = require('./router/routes')

const app = express()
app.use("/images", express.static(path.join(__dirname, "..", "public", "images")));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const port = 3000

app.use(cors())
app.use(express.json())

app.use('/api', routes)

app.listen(port, function () {
    console.log(`Listening on ${port}`)
})