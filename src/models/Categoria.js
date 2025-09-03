const mongoose = require ('mongoose');


const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  estado: { type: Boolean, default: true }
});


module.exports = mongoose.model('Categoria', categoriaSchema);
