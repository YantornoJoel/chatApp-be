const { response } = require("express");
const bcrypt = require('bcryptjs')
const Usuario = require('../models/usuario');
const { generarJwt } = require("../helpers/jwt");


// Crear usuario
const crearUsuario = async (req, res = response) => {

    try {

        const { email, password } = req.body;

        // Verificar que el email no exista
        const existeEmail = await Usuario.findOne({ email });
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya existe'
            })
        }

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario en BD
        await usuario.save();

        // Generar el token
        const token = await generarJwt(usuario.id);



        res.json({
            ok: true,
            usuario,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, algo salio mal..'
        });
    }
};

// Login
const login = async (req, res = response) => {


    try {
        const { email, password } = req.body;


        // Verificar si existe el email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        // Validar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(404).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        // Generar JWT
        const token = await generarJwt(usuarioDB.id);


        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error, algo salio mal..'
        });
    }
};


// Renovar token
const renewToken = async (req, res = response) => {

    const { uid } = req;

    // Generar un nuevo JWT
    const token = await generarJwt(uid);

    // Obtener el usuario mediante el uid
    const usuario = await Usuario.findById(uid);



    res.json({
        ok: true,
        usuario,
        token
    })
};


module.exports = {
    crearUsuario,
    login,
    renewToken
}