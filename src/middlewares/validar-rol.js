const Atleta = require('../models/Orden.js');

// Middleware para validar si el usuario es el dueño del perfil o un administrador
const validarPropietario = async (req, res, next) => {
  const usuarioAuth = req.usuario;
  const { id } = req.params;

  try {
    const atleta = await Atleta.findById(id);
    if (!atleta) {
      return res.status(404).json({ msg: 'Perfil de atleta no encontrado' });
    }

    if (usuarioAuth.rol === 'administrador') {
      return next();
    }

    if (usuarioAuth.rol === 'cliente' && atleta.usuario_id.toString() === usuarioAuth._id.toString()) {
      return next();
    }

    return res.status(403).json({ msg: 'No tienes permisos para modificar este perfil' });
  } catch (error) {
    return res.status(500).json({ msg: 'Error interno al verificar permisos', error: error.message });
  }
};

// Middleware genérico para validar que el rol del usuario esté permitido
const validarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    const { rol } = req.usuario;

    if (!rolesPermitidos.includes(rol)) {
      return res.status(403).json({ msg: `El servicio requiere uno de estos roles: ${rolesPermitidos.join(", ")}` });
    }

    next();
  };
};

module.exports = {
  validarPropietario,
  validarRol
};
