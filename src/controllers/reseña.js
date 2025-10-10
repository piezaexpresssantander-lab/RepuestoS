const Reseña = require('../models/Reseña.js');

const httpResena = {
  crearResena: async (req, res) => {
    try {
      const { usuario, distribuidor, producto, puntaje, comentario } = req.body;
      const nuevaResena = new Reseña({ usuario, distribuidor, producto, puntaje, comentario });
      await nuevaResena.save();
      res.status(201).json({ msg: 'Reseña registrada exitosamente', reseña: nuevaResena });
    } catch (error) {
      res.status(500).json({ msg: 'Error al registrar la reseña', error: error.message });
    }
  },

  listarResenasPorProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const resenas = await Reseña.find({ producto: id }).populate('usuario', 'nombre');
      res.json(resenas);
    } catch (error) {
      res.status(500).json({ msg: 'Error al listar reseñas', error: error.message });
    }
  },

  listarResenasPorDistribuidor: async (req, res) => {
    try {
      const { id } = req.params;
      const resenas = await Reseña.find({ distribuidor: id }).populate('usuario', 'nombre');
      res.json(resenas);
    } catch (error) {
      res.status(500).json({ msg: 'Error al listar reseñas', error: error.message });
    }
  },

  listarResenasPorUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const resenas = await Reseña.find({ usuario: id }).populate('producto', 'nombre');
      res.json(resenas);
    } catch (error) {
      res.status(500).json({ msg: 'Error al listar reseñas', error: error.message });
    }
  }
};

module.exports = { httpResena };