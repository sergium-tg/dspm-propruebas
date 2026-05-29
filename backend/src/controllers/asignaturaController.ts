import { Request, Response } from 'express';
import type { CollectionReference } from 'firebase-admin/firestore';
import { db } from '../config/firebaseAdmin';
import { Asignatura } from '../models/types';

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

    const asignatura: Asignatura = {
      id: docRef.id,
      nombre,
      profesor,
      periodo,
      promedioActual: 0,
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
        nombre: data.nombre as string,
        profesor: data.profesor as string,
        periodo: data.periodo as string,
        promedioActual: data.promedioActual as number,
      };
    });

    res.status(200).json(asignaturas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las asignaturas' });
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
