const mongoose = require ('mongoose');


const tokenSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  token: { type: String, required: true },
  fechaExpiracion: { type: Date, required: true }
});


module.exports = mongoose.model('Token', tokenSchema);
