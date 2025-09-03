const Producto = require('../models/Producto.js');

const productoHelper = {
  existeProductoID: async (id, req) => {
    if (id) {
      const existe = await Producto.findById(id);
      if (!existe) {
        throw new Error(`No existe producto con ese ID: ${id}`);
      }
      req.req.productobd = existe;
    }
  },

  existeNombreProducto: async (nombre, req) => {
    if (nombre) {
      const existe = await Producto.findOne({ nombre });
      if (existe && req.req.method !== "PUT") {
        throw new Error(`Ya existe un producto con ese nombre: ${nombre}`);
      }
    }
  }
};

module.exports = { productoHelper };