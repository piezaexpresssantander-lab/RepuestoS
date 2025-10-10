const Soporte = require('../models/Soporte.js');
const usuario = require('../models/usuario.js');

const httpSoporte = {
  crearSoporte: async (req, res) => {
    try {
      const { usuario, asunto, descripcion } = req.body;
      const soporte = new Soporte({ usuario, asunto, descripcion });
      await soporte.save();
      res.status(201).json({ msg: 'Soporte registrado exitosamente', soporte });
    } catch (error) {
      res.status(500).json({ msg: 'Error al registrar el soporte', error: error.message });
    }
  },

  listarSoportes: async (req, res) => {
    try {
      const soportes = await Soporte.find().populate('usuario');
      res.json(soportes);
    } catch (error) {
      res.status(500).json({ msg: 'Error al listar soportes', error: error.message });
    }
  },

  obtenerSoporte: async (req, res) => {
    try {
      const { id } = req.params;
      const soporte = await Soporte.findById(id).populate('usuario');
      if (!soporte) {
        return res.status(404).json({ msg: "Soporte no encontrado" });
      }
      res.json(soporte);
    } catch (error) {
      res.status(500).json({ msg: 'Error al obtener el soporte', error: error.message });
    }
  },

  actualizarSoporte: async (req, res) => {
    try {
      const { id } = req.params;
      const { asunto, descripcion, estado } = req.body;
      const soporte = await Soporte.findByIdAndUpdate(
        id,
        { asunto, descripcion, estado },
        { new: true }
      );
      if (!soporte) {
        return res.status(404).json({ msg: "Soporte no encontrado" });
      }
      res.json({ msg: "Soporte actualizado", soporte });
    } catch (error) {
      res.status(500).json({ msg: 'Error al actualizar el soporte', error: error.message });
    }
  },

  eliminarSoporte: async (req, res) => {
    try {
      const { id } = req.params;
      const soporte = await Soporte.findByIdAndDelete(id);
      if (!soporte) {
        return res.status(404).json({ msg: "Soporte no encontrado" });
      }
      res.json({ msg: "Soporte eliminado" });
    } catch (error) {
      res.status(500).json({ msg: 'Error al eliminar el soporte', error: error.message });
    }
  }
};

module.exports = { httpSoporte };