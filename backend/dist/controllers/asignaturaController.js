"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eliminarAsignatura = exports.obtenerAsignaturas = exports.crearAsignatura = void 0;
const firebaseAdmin_1 = require("../config/firebaseAdmin");
const paramString = (value) => Array.isArray(value) ? value[0] : value;
const asignaturasRef = (uid) => firebaseAdmin_1.db.collection('usuarios').doc(uid).collection('asignaturas');
const eliminarSubcoleccion = async (collectionRef) => {
    const snapshot = await collectionRef.limit(500).get();
    if (snapshot.empty) {
        return;
    }
    const batch = firebaseAdmin_1.db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    if (snapshot.size === 500) {
        await eliminarSubcoleccion(collectionRef);
    }
};
const crearAsignatura = async (req, res) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const { nombre, profesor, periodo } = req.body;
        if (!nombre || !profesor || !periodo) {
            res.status(400).json({ error: 'nombre, profesor y periodo son obligatorios' });
            return;
        }
        const docRef = await asignaturasRef(uid).add({
            nombre,
            profesor,
            periodo,
            promedioActual: 0,
        });
        const asignatura = {
            id: docRef.id,
            nombre,
            profesor,
            periodo,
            promedioActual: 0,
        };
        res.status(201).json({ message: 'Asignatura creada exitosamente', data: asignatura });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la asignatura' });
    }
};
exports.crearAsignatura = crearAsignatura;
const obtenerAsignaturas = async (req, res) => {
    try {
        const uid = req.user?.uid;
        if (!uid) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        const snapshot = await asignaturasRef(uid).get();
        const asignaturas = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                nombre: data.nombre,
                profesor: data.profesor,
                periodo: data.periodo,
                promedioActual: data.promedioActual,
            };
        });
        res.status(200).json(asignaturas);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las asignaturas' });
    }
};
exports.obtenerAsignaturas = obtenerAsignaturas;
const eliminarAsignatura = async (req, res) => {
    try {
        const uid = req.user?.uid;
        const id = paramString(req.params.id);
        if (!uid) {
            res.status(401).json({ error: 'Usuario no autenticado' });
            return;
        }
        if (!id) {
            res.status(400).json({ error: 'ID de asignatura requerido' });
            return;
        }
        const docRef = asignaturasRef(uid).doc(id);
        const docSnap = await docRef.get();
        if (!docSnap.exists) {
            res.status(404).json({ error: 'Asignatura no encontrada' });
            return;
        }
        await eliminarSubcoleccion(docRef.collection('notas'));
        await docRef.delete();
        res.status(200).json({ message: 'Asignatura eliminada exitosamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la asignatura' });
    }
};
exports.eliminarAsignatura = eliminarAsignatura;
//# sourceMappingURL=asignaturaController.js.map