import { Request, Response } from 'express';
import { db } from '../config/firebaseAdmin';
import { Usuario } from '../models/types';

export const crearUsuario = async (req: Request, res: Response): Promise<void> => {
  try {
    const { uid, nombres, correo, rol, codigo } = req.body as Partial<Usuario>;

    if (!uid || !nombres || !correo || !rol || !codigo) {
      res.status(400).json({ error: 'uid, nombres, correo, rol y codigo son obligatorios' });
      return;
    }

    const usuario: Usuario = {
      uid,
      nombres,
      correo,
      rol,
      codigo,
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

export const actualizarPerfil = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const { nombres, codigo } = req.body;

    const updates: Partial<Usuario> = {};
    if (nombres !== undefined) updates.nombres = nombres;
    if (codigo !== undefined) updates.codigo = codigo;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
      return;
    }

    await db.collection('usuarios').doc(uid).update(updates);

    res.status(200).json({ message: 'Perfil actualizado exitosamente', data: updates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};
