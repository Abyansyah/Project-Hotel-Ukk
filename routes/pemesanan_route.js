const bodyParser = require('body-parser');
const express = require('express')
const app = express()
app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const bookController = require(`../controller/pemesanan_controller`)

app.get("/", bookController.getPemesanan)
// app.post("/findtipe", bookController.findKamar)
app.post("/", bookController.addPemesanan)
app.put("/:id", bookController.updatePemesanan)
app.delete("/:id", bookController.deletePemesanan)

module.exports = app
