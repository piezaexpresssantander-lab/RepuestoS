const Orden = require('../models/Orden.js');

const ordenHelper = {
  existeOrdenID: async (id, req) => {
    if (id) {
      const existe = await Orden.findById(id);
      if (!existe) {
        throw new Error(`No existe orden con ese ID: ${id}`);
      }
      req.req.ordenbd = existe;
    }
  }
};

module.exports = { ordenHelper };