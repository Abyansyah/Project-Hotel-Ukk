const bodyParser = require('body-parser');
const express = require('express')
const app = express()
app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const bookController = require(`../controller/tipe_kamar_controller`)

app.get("/getAll", bookController.getAllTipekamar)
app.post("/findtipe", bookController.findTipekamar)
app.post("/", bookController.addUser)
app.put("/:id", bookController.updateTipe)
app.delete("/:id", bookController.deleteUser)

module.exports = app
