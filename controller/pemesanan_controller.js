const pemesananModel = require(`../models/index`).pemesanan;
const detail_pemesananModel = require(`../models/index`).detail_pemesanan;
const tipeModel = require(`../models/index`).tipe_kamar;
const userModel = require('../models/index').user;
const Op = require(`sequelize`).Op;

exports.addPemesanan = async (request, response) => {
  let nama_tipe_kamar = request.body.nama_tipe_kamar;
  let nama_user = request.body.nama_user;

  let tipe_Kamar = await tipeModel.findOne({
    where: {
      [Op.or]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
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
    id_tipe_kamar: tipe_Kamar.id,
    status_pemesanan: request.body.status_pemesanan,
    id_user: user.id,
  };
  pemesananModel
    .create(newData)
    .then((result) => {
      let pemesananID = result.id;
      let detail_pemesanan = request.body.detail_pemesanan;

      for (let i = 0; i < detail_pemesanan.length; i++) {
        detail_pemesanan[i].id_pemesanan = pemesananID;
      }

      detail_pemesananModel
        .bulkCreate(detail_pemesanan)
        .then((result) => {
          return response.json({
            success: true,
            message: `New Book Borrowed has been
inserted`,
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

exports.updatePemesanan = async (request, response) => {
  let nama_tipe_kamar = request.body.nama_tipe_kamar;
  let nama_user = request.body.nama_user;

  let tipe_Kamar = await tipeModel.findOne({
    where: {
      [Op.or]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
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
    id_tipe_kamar: tipe_Kamar.id,
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

      detail_pemesananModel
        .bulkCreate(detail_pemesanan)
        .then((result) => {
          return response.json({
            success: true,
            message: `Book Borrowed has been
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
      `tipe_kamar`,
      `user`,
      {
        model: detail_pemesananModel,
        as: `detail_pemesanan`,
        include: ['kamar'],
      },
    ],
  });
  return response.json({
    success: true,
    data: data,
    message: `All borrowing book have been loaded`,
  });
};
