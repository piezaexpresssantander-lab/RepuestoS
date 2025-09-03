const Distribuidor = require('../models/Distribuidor.js');

const distribuidorHelper = {
  existeDistribuidorID: async (id, req) => {
    if (id) {
      const existe = await Distribuidor.findById(id);
      if (existe) {
        if (req.req.method === "PUT") {
          if (existe._id.toString() !== req.req.distribuidorbd._id.toString())
            throw new Error(`Ya existe ese distribuidor en la base de datos!!! ${id}`);
        } else {
          throw new Error(`Ya existe ese distribuidor en la base de datos!!! ${id}`);
        }
      }
    }
  },

  existeDistribuidorPorUsuario: async (usuario, req) => {
    if (usuario) {
      const existe = await Distribuidor.findOne({ usuario });
      if (existe) {
        throw new Error(`Ya existe un distribuidor para ese usuario!!!`);
      }
    }
  },

  verificarDistribuidor: async (id, req) => {
    const existe = await Distribuidor.findById(id);
    if (!existe) {
      throw new Error(`El distribuidor no está registrado`);
    }
    req.req.distribuidorbd = existe;
  }
};

module.exports = { distribuidorHelper };