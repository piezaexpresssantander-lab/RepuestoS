const Reseña = require('../models/Reseña.js');

const reseñaHelper = {
  existeResenaDiariaPorUsuarioProducto : async (usuario, producto) => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  const existe = await Reseña.findOne({
    usuario,
    producto,
    createdAt: { $gte: hoy, $lt: manana }
  });

  if (existe) {
    throw new Error('Solo puedes dejar una reseña por producto al día');
  }
}
};

module.exports = { reseñaHelper };
