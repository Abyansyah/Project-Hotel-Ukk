const userModel = require('../models/index').user;
const upload = require(`./upload_foto_user`).single(`foto`);
const Op = require(`sequelize`).Op;
const path = require(`path`);
const fs = require(`fs`);
const md5 = require('md5');

const jsonwebtoken = require('jsonwebtoken');
const SECRET_KEY = 'secretcode';

exports.login = async (request, response) => {
  try {
    const params = {
      email: request.body.email,
      password: md5(request.body.password),
    };

    const findUser = await userModel.findOne({ where: params });
    if (findUser == null) {
      return response.status(404).json({
        message: "email or password doesn't match",
        err: error,
      });
    }
    console.log(findUser);
    let tokenPayLoad = {
      id_user: findUser.id_user,
      email: findUser.email,
      role: findUser.role,
    };
    tokenPayLoad = JSON.stringify(tokenPayLoad);
    let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY);

    return response.status(200).json({
      message: 'Success login',
      data: {
        token: token,
        id_user: findUser.id_user,
        email: findUser.email,
        role: findUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: 'Internal error',
      err: error,
    });
  }
};

exports.getAllUser = async (request, response) => {
  let users = await userModel.findAll();
  return response.json({
    success: true,
    data: users,
    message: `All Users have been loaded`,
  });
};

exports.findUser = async (request, response) => {
  let nama = request.body.nama_user;
  let users = await userModel.findAll({
    where: {
      [Op.or]: [{ nama_user: { [Op.substring]: nama } }],
    },
  });
  return response.json({
    success: true,
    data: users,
    message: `All Users have been loaded`,
  });
};

exports.addUser = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({
        message: error,
      });
    }
    if (!request.file) {
      return response.json({
        message: `Nothing to Upload`,
      });
    }

    let newUser = {
      nama_user: request.body.nama_user,
      foto: request.file.filename,
      email: request.body.email,
      password: md5(request.body.password),
      role: request.body.role,
    };

    userModel
      .create(newUser)
      .then((result) => {
        return response.json({
          success: true,
          data: result,
          message: `New User has been inserted`,
        });
      })
      .catch((error) => {
        return response.json({
          success: false,
          message: error.message,
        });
      });
  });
};

exports.updateUser = (request, response) => {
  upload(request, response, async (error) => {
    if (error) {
      return response.json({ message: error });
    }

    let id = request.params.id;
    let user = {
      nama_user: request.body.nama_user,
      foto: request.file.filename,
      email: request.body.email,
      password: md5(request.body.password),
      role: request.body.role,
    };

    if (request.file) {
      const selectedUser = await userModel.findOne({
        where: { id: id },
      });
      const oldCoverBook = selectedUser.foto;
      const pathCover = path.join(__dirname, `../foto`, oldCoverBook);
      if (fs.existsSync(pathCover)) {
        fs.unlink(pathCover, (error) => console.log(error));
      }
      user.foto = request.file.filename;
    }

    userModel
      .update(user, { where: { id: id } })
      .then((result) => {
        return response.json({
          success: true,
          message: `Data user has been updated`,
        });
      })
      .catch((error) => {
        return response.json({});
      });
  });
};

exports.deleteUser = async (request, response) => {
  const id = request.params.id;
  const user = await userModel.findOne({ where: { id: id } });
  const oldCoverBook = user.foto;
  const pathCover = path.join(__dirname, `../foto`, oldCoverBook);

  if (fs.existsSync(pathCover)) {
    fs.unlink(pathCover, (error) => console.log(error));
  }

  userModel
    .destroy({ where: { id: id } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data book has been deleted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
