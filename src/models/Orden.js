const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  distribuidor: { type: mongoose.Schema.Types.ObjectId, ref: 'Distribuidor', required: true },
  productos: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    cantidad: Number,
    precioUnitario: Number
  }],
  referenciaPago: { type: String },
  total: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Orden', ordenSchema);
