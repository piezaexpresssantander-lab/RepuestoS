const Categoria = require('../models/Categoria.js');

const categoriaHelper = {
  existeCategoriaID: async (id, req) => {
    if (id) {
      const existe = await Categoria.findById(id);
      if (!existe) {
        throw new Error(`No existe categoría con ese ID: ${id}`);
      }
      req.req.categoriabd = existe;
    }
  },

  existeNombreCategoria: async (nombre, req) => {
    if (nombre) {
      const existe = await Categoria.findOne({ nombre });
      if (existe && req.req.method !== "PUT") {
        throw new Error(`Ya existe una categoría con ese nombre: ${nombre}`);
      }
    }
  }
};

module.exports = { categoriaHelper };