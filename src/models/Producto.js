const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  marca: String,
  modeloMoto: String,
  distribuidor: { type: mongoose.Schema.Types.ObjectId, ref: 'Distribuidor' },
  imagen: String,
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' },
  estado: { type: Boolean, default: true }
}, { timestamps: true });


module.exports = mongoose.model('Producto', productoSchema);
