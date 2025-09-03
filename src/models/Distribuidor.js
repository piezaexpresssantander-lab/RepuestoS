const mongoose = require('mongoose');
const axios = require('axios');

const distribuidorSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  ciudad: String,
  inventarioAPI: String, // URL para conectar con su catálogo si tienen API
  estado: { type: Boolean, default: true }
}, { timestamps: true });

// Método de instancia: obtiene inventario desde inventarioAPI
distribuidorSchema.methods.fetchInventario = async function (opts = {}) {
  if (!this.inventarioAPI) throw new Error('No existe inventarioAPI para este distribuidor');
  const { timeout = 5000, headers = {} } = opts;
  try {
    const res = await axios.get(this.inventarioAPI, { timeout, headers });
    // Si la API devuelve JSON normalmente:
    return res.data;
    // Si puede devolver XML, usar fast-xml-parser o xml2js aquí para parsear según res.headers['content-type']
  } catch (err) {
    // manejar/loggear según convenga
    throw new Error(`Error al obtener inventario: ${err.message}`);
  }
};

module.exports = mongoose.model('Distribuidor', distribuidorSchema);
