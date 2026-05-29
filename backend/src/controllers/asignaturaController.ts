import { Request, Response } from 'express';
import type { CollectionReference } from 'firebase-admin/firestore';
import { db } from '../config/firebaseAdmin';
import { Asignatura } from '../models/types';
import { actualizarDatosGlobalesUsuario } from '../services/userService';

const paramString = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const asignaturasRef = (uid: string) =>
  db.collection('usuarios').doc(uid).collection('asignaturas');

const eliminarSubcoleccion = async (collectionRef: CollectionReference): Promise<void> => {
  const snapshot = await collectionRef.limit(500).get();

  if (snapshot.empty) {
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  if (snapshot.size === 500) {
    await eliminarSubcoleccion(collectionRef);
  }
};

export const crearAsignatura = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const { descripcion, creditos } = req.body;

    if (!descripcion) {
      res.status(400).json({ error: 'La descripción es obligatoria' });
      return;
    }

    const creditosNum = creditos !== undefined ? Number(creditos) : 3;

    const data = {
      descripcion,
      creditos: creditosNum,
      promedio: 0,
      aprueba: false,
    };

    const docRef = await asignaturasRef(uid).add(data);

    const asignatura: Asignatura = {
      id: docRef.id,
      ...data,
    };

    res.status(201).json({ message: 'Asignatura creada exitosamente', data: asignatura });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la asignatura' });
  }
};

export const obtenerAsignaturas = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;

    if (!uid) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    const snapshot = await asignaturasRef(uid).get();
    const asignaturas: Asignatura[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        descripcion: (data.descripcion || data.nombre) as string,
        creditos: (data.creditos as number) || 3,
        promedio: (data.promedio as number) || 0,
        aprueba: (data.aprueba as boolean) || false,
      };
    });

    res.status(200).json(asignaturas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las asignaturas' });
  }
};

export const obtenerAsignaturaPorId = async (req: Request, res: Response): Promise<void> => {
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

    const data = docSnap.data();
    const asignatura: Asignatura = {
      id: docSnap.id,
      descripcion: (data?.descripcion || data?.nombre) as string,
      creditos: (data?.creditos as number) || 3,
      promedio: (data?.promedio as number) || 0,
      aprueba: (data?.aprueba as boolean) || false,
    };

    res.status(200).json(asignatura);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la asignatura' });
  }
};

export const eliminarAsignatura = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la asignatura' });
  }
};

export const actualizarAsignatura = async (req: Request, res: Response): Promise<void> => {
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

    const { descripcion, creditos, promedio, aprueba } = req.body;

    const updates: any = {};
    if (descripcion !== undefined) updates.descripcion = descripcion;
    if (creditos !== undefined) updates.creditos = Number(creditos);
    if (promedio !== undefined) updates.promedio = Number(promedio);
    if (aprueba !== undefined) updates.aprueba = Boolean(aprueba);

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
      return;
    }

    const docRef = asignaturasRef(uid).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      res.status(404).json({ error: 'Asignatura no encontrada' });
      return;
    }

    await docRef.update(updates);

    res.status(200).json({ message: 'Asignatura actualizada exitosamente', data: updates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la asignatura' });
  }
};
