const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const auth = require('../auth/auth')
app.use(express.json())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const bookController = require(`../controller/user_controller`)

app.post('/login', bookController.login)
app.get("/getAll", auth.authVerify, bookController.getAllUser)
app.post("/finduser", auth.authVerify, bookController.findUser)
app.post("/", auth.authVerify, bookController.addUser)
app.put("/:id", auth.authVerify, bookController.updateUser)
app.delete("/:id", auth.authVerify, bookController.deleteUser)

module.exports = app
