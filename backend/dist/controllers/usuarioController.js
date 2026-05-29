"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerPerfil = exports.crearUsuario = void 0;
const firebaseAdmin_1 = require("../config/firebaseAdmin");
const crearUsuario = async (req, res) => {
    try {
        const { uid, nombre, correo, rol, codigo, carrera } = req.body;
        if (!uid || !nombre || !correo || !rol) {
            res.status(400).json({ error: 'uid, nombre, correo y rol son obligatorios' });
            return;
        }
        const usuario = {
            uid,
            nombre,
            correo,
            rol,
            ...(codigo !== undefined && { codigo }),
            ...(carrera !== undefined && { carrera }),
        };
        await firebaseAdmin_1.db.collection('usuarios').doc(uid).set(usuario);
        res.status(201).json({ message: 'Usuario creado exitosamente', data: usuario });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};
exports.crearUsuario = crearUsuario;
const obtenerPerfil = async (req, res) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const doc = await firebaseAdmin_1.db.collection('usuarios').doc(uid).get();
        if (!doc.exists) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json(doc.data());
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el perfil' });
    }
};
exports.obtenerPerfil = obtenerPerfil;
//# sourceMappingURL=usuarioController.js.map