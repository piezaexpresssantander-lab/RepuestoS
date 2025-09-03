const express = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { httpPago } = require("../controllers/pago.js");
const { pagoHelper } = require('../helpers/pago');
const { validarJWT } = require('../middlewares/validar-token.js');
const router = express.Router();

// Crear pago
router.post("/crear", [
  validarJWT,
  check('ordenId', 'La orden es obligatoria').isMongoId(),
  check('usuarioId', 'El usuario es obligatorio').isMongoId(),
  check('metodo', 'El método de pago es obligatorio').not().isEmpty(),
  check('totalPagado', 'El total pagado es obligatorio').isFloat({ min: 0.01 }),
  check('referencia').optional().isString(),
  validarCampos
], httpPago.crearPago);

// Listar todos los pagos
router.get("/listarTodo", validarJWT, httpPago.listarPagos);

// Obtener pago por ID
router.get("/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  check('id').custom(pagoHelper.existePagoID),
  validarCampos
], httpPago.obtenerPago);

// Actualizar pago
router.put("/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpPago.actualizarPago);

// Eliminar pago
router.delete("/:id", [
  validarJWT,
  check('id', 'No es un ID válido').isMongoId(),
  validarCampos
], httpPago.eliminarPago);

module.exports = router;