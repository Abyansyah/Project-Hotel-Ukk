const pemesananModel = require(`../models/index`).pemesanan;
const detail_pemesananModel = require(`../models/index`).detail_pemesanan;
const tipeModel = require(`../models/index`).kamar;
const userModel = require('../models/index').user;
const Op = require(`sequelize`).Op;
const Sequelize = require('sequelize');
const sequelize = new Sequelize('wikusama_hotel', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

exports.addPemesanan = async (request, response) => {
  try {
    let nomor_kamar = request.body.nomor_kamar;
    let nama_user = request.body.nama_user;

    let room = await tipeModel.findOne({
      where: {
        [Op.or]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
      },
      attributes: ['id', 'nomor_kamar', 'id_tipe_kamar', 'createdAt', 'updatedAt'],
    });
    
    let user = await userModel.findOne({
      where: {
        [Op.or]: [{ nama_user: { [Op.substring]: nama_user } }],
      },
    });

    if (room === null) {
      return response.json({
        success: false,
        message: `Kamar yang anda inputkan tidak ditemukan`,
      });
    } else if (user === null) {
      return response.json({
        success: false,
        message: `User yang anda inputkan tidak ditemukan`,
      });
    } else {
      let newData = {
        nomor_pemesanan: request.body.nomor_pemesanan,
        nama_pemesanan: request.body.nama_pemesanan,
        email_pemesanan: request.body.email_pemesanan,
        tgl_pemesanan: request.body.tgl_pemesanan,
        tgl_check_in: request.body.tgl_check_in,
        tgl_check_out: request.body.tgl_check_out,
        nama_tamu: request.body.nama_tamu,
        jumlah_kamar: request.body.jumlah_kamar,
        id_tipe_kamar: room.id,
        status_pemesanan: request.body.status_pemesanan,
        id_user: user.id,
      };

      let roomCheck = await sequelize.query(`SELECT * FROM detail_pemesanans WHERE id_kamar = ${room.id} AND tgl_akses= "${request.body.check_in}" ;`);

      if (roomCheck[0].length === 0) {
        pemesananModel
          .create(newData)
          .then((result) => {
            let pemesananID = result.id;
            let detail_pemesanan = request.body.detail_pemesanan;

            for (let i = 0; i < detail_pemesanan.length; i++) {
              detail_pemesanan[i].id_pemesanan = pemesananID;
            }

            let newDetail = {
              id_pemesanan: pemesananID,
              id_kamar: room.id,
              tgl_akses: result.tgl_check_in,
              harga: detail_pemesanan[0].harga,
            };

            detail_pemesananModel
              .create(newDetail)
              .then((result) => {
                return response.json({
                  success: true,
                  message: `New pemesanans has been inserted`,
                });
              })
              .catch((error) => {
                return response.json({
                  success: false,
                  message: error.message,
                });
              });
          })
          .catch((error) => {
            return response.json({
              success: false,
              message: error.message,
            });
          });
      } else {
        return response.json({
          success: false,
          message: `Kamar yang anda pesan sudah di booking`,
        });
      }
    }
  } catch (error) {
    return response.json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePemesanan = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar;
  let nama_user = request.body.nama_user;

  let kamar = await tipeModel.findOne({
    where: {
      [Op.or]: [{ nomor_kamar: { [Op.substring]: nomor_kamar } }],
    },
  });
  let user = await userModel.findOne({
    where: {
      [Op.or]: [{ nama_user: { [Op.substring]: nama_user } }],
    },
  });

  let newData = {
    nomor_pemesanan: request.body.nomor_pemesanan,
    nama_pemesanan: request.body.nama_pemesanan,
    email_pemesanan: request.body.email_pemesanan,
    tgl_pemesanan: request.body.tgl_pemesanan,
    tgl_check_in: request.body.tgl_check_in,
    tgl_check_out: request.body.tgl_check_out,
    nama_tamu: request.body.nama_tamu,
    jumlah_kamar: request.body.jumlah_kamar,
    id_tipe_kamar: kamar.id,
    status_pemesanan: request.body.status_pemesanan,
    id_user: user.id,
  };
  let borrowID = request.params.id;

  pemesananModel
    .update(newData, { where: { id: borrowID } })
    .then(async (result) => {
      await detail_pemesananModel.destroy({ where: { id_pemesanan: borrowID } });

      let detail_pemesanan = request.body.detail_pemesanan;

      for (let i = 0; i < detail_pemesanan.length; i++) {
        detail_pemesanan[i].id_pemesanan = borrowID;
      }

      let newDetail = {
        id_pemesanan: pemesananID,
        id_kamar: room.id,
        tgl_akses: detail_pemesanan[0].tgl_akses,
        harga: detail_pemesanan[0].harga,
      };

      detail_pemesananModel
        .create(newDetail)
        .then((result) => {
          return response.json({
            success: true,
            message: `Pemesanan has been
    updated`,
          });
        })
        .catch((error) => {
          return response.json({
            success: false,
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.deletePemesanan = async (request, response) => {
  let borrowID = request.params.id;

  detail_pemesananModel
    .destroy({ where: { id_pemesanan: borrowID } })
    .then((result) => {
      pemesananModel
        .destroy({ where: { id: borrowID } })
        .then((result) => {
          return response.json({
            success: true,
            message: `Borrowing Book's has deleted`,
          });
        })
        .catch((error) => {
          return response.json({
            success: false,
            message: error.message,
          });
        });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.getPemesanan = async (request, response) => {
  let data = await pemesananModel.findAll({
    include: [
      `kamars`,
      `users`,
      {
        model: detail_pemesananModel,
        as: `detail_pemesanan`,
        include: ['kamars'],
      },
    ],
  });
  return response.json({
    success: true,
    data: data,
    message: `All borrowing book have been loaded`,
  });
};
