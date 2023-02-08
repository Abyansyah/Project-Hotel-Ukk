const kamarModel = require('../models/index').kamar;
const tipeKamar = require('../models/index').tipe_kamar;
const Op = require('sequelize').Op;
const { response } = require('express');
const md5 = require('md5');
const { request } = require('../routes/pemesanan_route');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('wikusama_hotel', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

exports.getAllkamar = async (request, response) => {
  const result = await sequelize.query('SELECT kamars.id,kamars.nomor_kamar,tipe_kamars.nama_tipe_kamar FROM kamars JOIN tipe_kamars ON tipe_kamars.id = kamars.id_tipe_kamar ORDER BY kamars.id ASC');
  return response.json({
    success: true,
    data: result[0],
    message: `Kamar have been loaded`,
  });
};

exports.findKamar = async (request, response) => {
  let nomor_kamar = request.body.nomor_kamar;

  const result = await sequelize.query(
    `SELECT kamars.id,kamars.nomor_kamar,tipe_kamars.nama_tipe_kamar FROM kamars JOIN tipe_kamars ON tipe_kamars.id = kamars.id_tipe_kamar where kamars.nomor_kamar= ${nomor_kamar} ORDER BY kamars.id ASC `
  );
  return response.json({
    success: true,
    data: result[0],
    message: `Kamar have been loaded`,
  });
};

exports.checkTersedia = async (request, response) => {
  let tgl_check_in = request.body.tgl_check_in;
  let tgl_check_out = request.body.tgl_check_out;

  const result = await sequelize.query(
    `SELECT tipe_kamars.*, count(kamars.id) as sisa_kamar FROM kamars LEFT JOIN tipe_kamars ON kamars.id = tipe_kamars.id LEFT JOIN detail_pemesanans ON detail_pemesanans.id_kamar = kamars.id AND detail_pemesanans.tgl_akses BETWEEN ${tgl_check_in} AND ${tgl_check_out} WHERE detail_pemesanans.tgl_akses IS NULL GROUP BY tipe_kamars.id`
  );
  return response.json({
    success: true,
    data: result[0],
    message: `Kenek`,
  });
};

exports.addKamar = async (request, response) => {
  let nama_tipe_kamar = request.body.nama_tipe_kamar;
  let tipe_Kamar = await tipeKamar.findOne({
    where: {
      [Op.or]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
    },
  });

  let newKamar = {
    nomor_kamar: request.body.nomor_kamar,
    id_tipe_kamar: tipe_Kamar.id,
  };

  kamarModel
    .create(newKamar)
    .then((result) => {
      return response.json({
        success: true,
        data: result,
        message: `New Admin has been inserted`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.updateKamar = async (request, response) => {
  let searchKamar = request.params.id;
  let nama_tipe_kamar = request.body.nama_tipe_kamar;
  let tipe_Kamar = await tipeKamar.findOne({
    where: {
      [Op.or]: [{ nama_tipe_kamar: { [Op.substring]: nama_tipe_kamar } }],
    },
  });

  let newKamar = {
    nomor_kamar: request.body.nomor_kamar,
    id_tipe_kamar: tipe_Kamar.id,
  };

  kamarModel
    .update(newKamar, { where: { id: searchKamar } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data Admin has been updated`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};

exports.deleteKamar = (request, response) => {
  let idAdmin = request.params.id;

  kamarModel
    .destroy({ where: { id: idAdmin } })
    .then((result) => {
      return response.json({
        success: true,
        message: `Data admin has been updated`,
      });
    })
    .catch((error) => {
      return response.json({
        success: false,
        message: error.message,
      });
    });
};
