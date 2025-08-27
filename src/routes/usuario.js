const express = require('express');
const {check} = require('express-validator');
// const nodemailer = require("nodemailer");

const {validarCampos} = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
const router = express.Router();

const { httpUsuarios } = require("../controllers/usuarios.js");
const {usuarioHelper}=require('../helpers/usuario');

const { validarJWT } = require('../middlewares/validar-token.js');
const jwt = require('jsonwebtoken');



router.get("/listarUsuarios",[
    // validarJWT,
    validarCampos,
], httpUsuarios.getUsuarios); // listar todo

  // listar por id
router.get("/listarpor/:id",[
    // validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(usuarioHelper.existeUsuarioID),
    validarCampos
], httpUsuarios.getUsuariosXId);
 // listar activos e inactivos

router.get("/activos_inactivos",httpUsuarios.getActivos);

router.post("/insertarUsuario", [
        // validarJWT,
        check('email', 'El documento es obligatorio!').not().isEmpty(),
        check('nombre', 'El documento es obligatorio!').not().isEmpty(),
        check('email').custom( usuarioHelper.existeEmail ),
        check('password', 'Password no es válido').isLength({ min: 8}),
        validarCampos
       ] , httpUsuarios.postUsuarioInsertar); //insertar ususario

       
router.post("/login",[
    // validarJWT,
    check('email', 'El documento es obligatorio!').not().isEmpty(),
    check('email').custom( usuarioHelper.verificarEmail ),
    check('password', 'Password no es válido').isLength({ min: 8}),
    validarCampos,
    
], httpUsuarios.postLogin); // login usuario
    


router.put("/cambiarContra/:id",[ 
    // validarJWT,
    check('id', 'No es un ID válido').isMongoId(), 
    check('id').custom(usuarioHelper.existeUsuarioID), 
    check('newPassword', 'Password obligatoria').isLength({ min: 8}),
 validarCampos
], httpUsuarios.putcambiarContraseña); // cambio contraseña


router.put("/editarUsuario/:id",[
    // validarJWT,
    check('id', 'No es un ID válido').isMongoId(), 
    // check('id').custom(usuarioHelper.existeUsuarioID),
    check ('nombre', 'El nombre es obligatorio!').not().isEmpty(),
    check('email', 'El documento es obligatorio!').not().isEmpty(),
    // check('email').custom( usuarioHelper.existeEmail ),
    // check('password', 'Password no es válido').isLength({ min: 8}),
        validarCampos
], httpUsuarios.putEditarUsuario); // modificar


//recuperacion de codigo
 router.post("/enviar-codigo", [
  check('email', 'Email es obligatorio').isEmail(),
  validarCampos
], httpUsuarios.enviarCodigoRecuperacion);

router.post("/confirmar-codigo", [
  check('email', 'Email es obligatorio').isEmail(),
  check('codigo', 'Código es obligatorio').notEmpty(),
  validarCampos
], httpUsuarios.confirmarCodigo);

router.post("/recuperar-password", [
  check('email', 'Email es obligatorio').isEmail(),
  check('nuevaPassword', 'Password debe tener mínimo 8 caracteres').isLength({ min: 8 }),
  validarCampos
], httpUsuarios.recuperarPassword);

router.put("/activarUsuario/:id",[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(usuarioHelper.existeUsuarioID),
    validarCampos
], httpUsuarios.putActivarUsuario); // activar

router.put("/desactivarUsuario/:id",[
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(), 
    check('id').custom(usuarioHelper.existeUsuarioID),
    validarCampos
    ], httpUsuarios.putDesactivarUsuario); // desactivar



module.exports = router;


// const {Router}=require('express')
// const {httpUsuarios}=require("../controllers/usuarios")

// const router= Router()

// router.get("/listarUsuario",httpUsuarios.getUsuarios) //listar todo
// router.get("/listarpor/:id",httpUsuarios.getUsuariosXId) //listar por id
// router.get("/activos_inactivos",httpUsuarios.getActivos) //listar activos e inactivos

// router.post("/insertarUsuario",httpUsuarios.postUsuarioinsertar)  //inssertar
// router.post("/login",httpUsuarios.postLogin)//login usuario

// // router.post("/",httpUsuarios.postcontraseña) //cambio contraseña
// router.put("/editarUsuario/:id",httpUsuarios.posteditarusuario) //modificar
// // router.put("/") //activar
// // router.put("/")//desactivar

// module.exports = router;
