const Pago = require('../models/Pago.js');

const pagoHelper = {
  existePagoID: async (id, req) => {
    if (id) {
      const existe = await Pago.findById(id);
      if (!existe) {
        throw new Error(`No existe pago con ese ID: ${id}`);
      }
      req.req.pagobd = existe;
    }
  },

  existeReferenciaPago: async (referencia, req) => {
    if (referencia) {
      const existe = await Pago.findOne({ referencia });
      if (existe && req.req.method !== "PUT") {
        throw new Error(`Ya existe un pago con esa referencia: ${referencia}`);
      }
    }
  }
};

module.exports = { pagoHelper };