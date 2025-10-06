const express = require('express');
const { check } = require('express-validator');
const { httpCarrito } = require("../controllers/carrito.js");
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-token.js');
const carrito = require('../models/Carrito.js');

const router = express.Router();

// Crear carrito
router.post('/crear', [
  // validarJWT,
  check('productos', 'Debes enviar productos').isArray({ min: 1 }),
  validarCampos
], httpCarrito.postCrearCarrito);


// Listar carritos de usuario
router.get('/listar', [
  // validarJWT,
  validarCampos
], httpCarrito.getCarritosUsuario);

// Obtener carrito por ID
router.get('/listarpor/:id', [
  // validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpCarrito.getCarritoPorId);



// Validar stock antes de confirmar orden
router.get('/validar-stock/:id', [
  // validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpCarrito.getValidarStock);


// Editar carrito (quitar productos)
router.put('/quitar/:id', [
  // validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('productos', 'Debes enviar productos').isArray({ min: 1 }),
  validarCampos
], httpCarrito.putEditarCarrito);

// Limpiar carritos abandonados
router.delete('/limpiar-abandonados', [
  // validarJWT,
  validarCampos
], httpCarrito.deleteLimpiarAbandonados);


// Eliminar carrito
router.delete('/eliminar/:id', [
  // validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpCarrito.deleteCarrito);


// Activar categoría
router.put('/activar/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpCarrito.putActivar);

// Desactivar categoría
router.put('/desactivar/:id', [
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpCarrito.putDesactivar);

module.exports = router;