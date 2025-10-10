const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { httpSoporte } = require("../controllers/soporte.js");
const { validarJWT } = require('../middlewares/validar-token.js');
const router = express.Router();

// Crear soporte
router.post("/crear", [
  validarJWT,
  check('usuario', 'El usuario es obligatorio').isMongoId(),
  check('asunto', 'El asunto es obligatorio').not().isEmpty(),
  check('descripcion', 'La descripción es obligatoria').not().isEmpty(),
  validarCampos
], httpSoporte.crearSoporte);

// Listar todos los soportes
router.get("/listarTodo", validarJWT, httpSoporte.listarSoportes);

// Obtener soporte por ID
router.get("/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpSoporte.obtenerSoporte);

// Actualizar soporte
router.put("/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpSoporte.actualizarSoporte);

// Eliminar soporte
router.delete("/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpSoporte.eliminarSoporte);

module.exports = router;