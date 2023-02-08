const bodyParser = require('body-parser');
const express = require('express')
const app = express()
app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const bookController = require(`../controller/kamar`)

app.get("/getAll", bookController.getAllkamar)
app.post("/findtipe", bookController.findKamar)
app.post("/", bookController.addKamar)
app.post("/check", bookController.checkTersedia);
app.put("/:id", bookController.updateKamar)
app.delete("/:id", bookController.deleteKamar)

module.exports = app
