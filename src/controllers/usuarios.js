const Usuario = require("../models/usuario.js");
const nodemailer = require("nodemailer");

const bcryptjs = require("bcryptjs");

const { generarJWT } = require("../middlewares/validar-token");

const codigosVerificacionTemporales = [];

const httpUsuarios = {
  getUsuarios: async (req, res) => {
    try {
      const usuario = await Usuario.find();
      res.json(usuario);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getUsuariosXId: async (req, res) => {
    const { id } = req.params;
    try {
      const usuario = await Usuario.findById(id);
      if (usuario) res.json({ usuario });
      else res.status(400).json({ msg: "Usuario no encontrado" });
    } catch (error) {
      res.status(400).json({ error });
    }
  },
  getActivos: async (req, res) => {
    try {
      const usuarios = await Usuario.find({ estado: { $in: [0, 1] } }); // Fetch both active and inactive users
      const usuariosActivos = usuarios.filter(
        (usuario) => usuario.estado === 1
      ); // Filter active users
      const usuariosInactivos = usuarios.filter(
        (usuario) => usuario.estado === 0
      ); // Filter inactive users
      res.json({ usuariosActivos, usuariosInactivos });
    } catch (error) {
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  },

postUsuarioInsertar: async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;


    const usuario = new Usuario({
      nombre,
      email,
      password,
      rol
    });

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.json({ usuario });
  } catch (error) {
    res.status(400).json({ error: "No se encuentran parámetros" });
  }
},

  postLogin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await Usuario.findOne({ email });

      // SI NO EXISTE el usuario: mostrar mensaje y sugerencia de registro
      if (!user) {
        return res.status(404).json({
          msg: "El usuario no está registrado.",
          registrarse: true, // Para que el frontend muestre botón de registro
        });
      }

      // Usuario inactivo
      if (user.estado === 0) {
        return res.status(401).json({
          msg: "Usuario inactivo. Contacte con el administrador.",
        });
      }

      // Contraseña incorrecta
      const validPassword = bcryptjs.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          msg: "Usuario / Password no son correctos",
        });
      }

      const token = await generarJWT(user._id);
      res.json({
        usuario: user,
        token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        msg: "Hable con el WebMaster",
      });
    }
  },

  putcambiarContraseña: async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    try {
      const usuario = await Usuario.findById(id);
      if (usuario) {
        const salt = bcryptjs.genSaltSync(10); // Genera una salt para hashear la contraseña
        const hashedPassword = bcryptjs.hashSync(newPassword, salt); // Hashea la nueva contraseña
        usuario.password = hashedPassword; // Guarda la contraseña hasheada en el usuario
        await usuario.save();
        res.json({ msg: "Contraseña actualizada correctamente" });
      } else {
        res.status(404).json({ msg: "Usuario no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  putEditarUsuario: async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, estado } = req.body;

  try {
    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    if (usuario.estado !== 1) {
      return res.status(401).json({ msg: "Usuario inactivo" });
    }

    if (nombre) {
      usuario.nombre = nombre;
    }

    if (email) {
      usuario.email = email;
    }

    if (password) {
      const hashedPassword = bcryptjs.hashSync(password, 10);
      usuario.password = hashedPassword;
    }

    if (estado !== undefined) {
      usuario.estado = estado;
    }

    await usuario.save();
    // res.json ({});
    res.json({ msg: "Usuario actualizado correctamente", usuario  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},

  putActivarUsuario: async (req, res) => {
    const { id } = req.params;
    try {
      const usuario = await Usuario.findById(id);

      if (!usuario) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
      }

      if (usuario.estado === 1) {
        return res.status(400).json({ msg: "El usuario ya está activo" });
      }
      usuario.estado = 1; // Cambiar estado a activo
      await usuario.save(); // Guardar el usuario actualizado en la base de datos
      res.json({ msg: "Usuario activado correctamente", usuario });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  putDesactivarUsuario: async (req, res) => {
    const { id } = req.params;

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(401).json({ msg: "Usuario no existe" });
    }

    if (usuario.estado === 0) {
      return res.status(401).json({ msg: "Usuario ya está inactivo" });
    }

    usuario.estado = 0;
    await usuario.save();

    res.json({ usuario });
  },

enviarCodigoRecuperacion: async (req, res) => {
  const { email } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      // Responde igual aunque no exista (seguridad)
      return res.json({ msg: "Si existe la cuenta, se envió el correo" });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    const index = codigosVerificacionTemporales.findIndex(obj => obj.email === email);
    if (index !== -1) {
      codigosVerificacionTemporales[index].codigo = codigo;
      codigosVerificacionTemporales[index].timestamp = Date.now();
      codigosVerificacionTemporales[index].intentos = 0; // Recomendado: reiniciar intentos
      codigosVerificacionTemporales[index].estado = "pendiente";
    } else {
      codigosVerificacionTemporales.push({
        email,
        codigo,
        timestamp: Date.now(),
        intentos: 0,
        estado: "pendiente"
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.userEmail,
        pass: process.env.password,
      },
    });

    await transporter.sendMail({
      from: process.env.userEmail,
      to: email,
      subject: "Código de recuperación",
      text: `Tu código de recuperación es: ${codigo}`,
    });

    res.json({ msg: "Si existe la cuenta, se envió el correo" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
},


confirmarCodigo: async (req, res) => {
  const { email, codigo } = req.body;
  const registro = codigosVerificacionTemporales.find(obj => obj.email === email);

  if (!registro) return res.status(404).json({ msg: "No se ha solicitado código para este correo" });

  if (Date.now() - registro.timestamp > 600000) {
    codigosVerificacionTemporales.splice(codigosVerificacionTemporales.indexOf(registro), 1);
    return res.status(400).json({ msg: "El código ha expirado, solicita uno nuevo" });
  }

  if (registro.intentos >= 5) {
    codigosVerificacionTemporales.splice(codigosVerificacionTemporales.indexOf(registro), 1);
    return res.status(400).json({ msg: "Demasiados intentos, solicita un nuevo código" });
  }

  if (registro.codigo !== codigo) {
    registro.intentos += 1;
    return res.status(400).json({ msg: "Código incorrecto" });
  }

  // Código correcto, SOLO marcas como "verificado" (NO lo elimines)
  registro.estado = "verificado";
  res.json({ msg: "Código verificado" });
},

recuperarPassword: async (req, res) => {
  const { email, nuevaPassword } = req.body;
  try {
    const registro = codigosVerificacionTemporales.find(obj => obj.email === email);

    // Solo deja continuar si el código fue verificado
    if (!registro || registro.estado !== "verificado") {
      return res.status(400).json({ msg: "Primero verifica el código de recuperación" });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(nuevaPassword, salt);
    await usuario.save();

    // Elimina el registro temporal de recuperación para este correo
    codigosVerificacionTemporales.splice(codigosVerificacionTemporales.indexOf(registro), 1);

    res.json({ msg: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
};
module.exports = { httpUsuarios };
