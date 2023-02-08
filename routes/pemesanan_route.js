const bodyParser = require('body-parser');
const express = require('express')
const app = express()
app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const bookController = require(`../controller/pemesanan_controller`)

app.get("/", bookController.getBorrow)
// app.post("/findtipe", bookController.findKamar)
app.post("/", bookController.addPemesanan)
app.put("/:id", bookController.updateBorrowing)
app.delete("/:id", bookController.deleteBorrowing)

module.exports = app
