const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { httpOrden } = require("../controllers/orden.js");
const { ordenHelper } = require('../helpers/orden');
const { validarJWT } = require('../middlewares/validar-token.js');
const router = express.Router();

// Crear orden
router.post("/crear", [
  validarJWT,
  check('cliente', 'El cliente es obligatorio').isMongoId(),
  check('distribuidor', 'El distribuidor es obligatorio').isMongoId(),
  check('productos', 'Productos es obligatorio').isArray({ min: 1 }),
  check('total', 'El total es obligatorio').isFloat({ min: 0.01 }),
  validarCampos
], httpOrden.crearOrden);

// Listar todas las órdenes
router.get("/listarTodo", validarJWT, httpOrden.listarOrdenes);


router.put('/tracking/:id', [
  // validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('trackingNumber', 'El número de guía es obligatorio').not().isEmpty(),
  check('urlTracking', 'La URL de tracking es obligatoria').isURL(),
  check('transportadora', 'La transportadora es obligatoria').not().isEmpty(),
  validarCampos
], httpOrden.actualizarTracking);

// Obtener orden por ID
router.get("/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(ordenHelper.existeOrdenID),
  validarCampos
], httpOrden.obtenerOrden);

// Actualizar orden
router.put("/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpOrden.actualizarOrden);

// Eliminar orden
router.delete("/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpOrden.eliminarOrden);

// Cambiar estado de la orden
router.put("/estado/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('estado', 'Estado no válido').isIn(['pendiente', 'en_curso', 'completada', 'cancelada']),
  validarCampos
], httpOrden.cambiarEstado);

module.exports = router;