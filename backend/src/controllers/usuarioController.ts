import { Request, Response } from 'express';
import { db } from '../config/firebaseAdmin';
import { Usuario } from '../models/types';

export const crearUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, nombre, correo, rol, codigo, carrera } = req.body as Partial<Usuario>;

    if (!uid || !nombre || !correo || !rol) {
      res.status(400).json({ error: 'uid, nombre, correo y rol son obligatorios' });
      return;
    }

    const usuario: Usuario = {
      uid,
      nombre,
      correo,
      rol,
      ...(codigo !== undefined && { codigo }),
      ...(carrera !== undefined && { carrera }),
    };

    await db.collection('usuarios').doc(uid).set(usuario);

    res.status(201).json({ message: 'Usuario creado exitosamente', data: usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
};

export const obtenerPerfil = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const doc = await db.collection('usuarios').doc(uid).get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json(doc.data() as Usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};
