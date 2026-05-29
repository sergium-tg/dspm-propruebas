import { Request, Response } from 'express';
import { db } from '../config/firebaseAdmin';
import { Nota } from '../models/types';
import { calcularPromedioDesdeNotas } from '../services/calculations';

const paramString = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

const notasRef = (uid: string, idAsignatura: string) =>
  db
    .collection('usuarios')
    .doc(uid)
    .collection('asignaturas')
    .doc(idAsignatura)
    .collection('notas');

const asignaturaDocRef = (uid: string, idAsignatura: string) =>
  db.collection('usuarios').doc(uid).collection('asignaturas').doc(idAsignatura);

const actualizarPromedioAsignatura = async (uid: string, idAsignatura: string): Promise<void> => {
  const snapshot = await notasRef(uid, idAsignatura).get();
  const notas: Nota[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      nombre: data.nombre as string,
      nota: data.nota as number,
      porcentaje: data.porcentaje as number,
    };
  });

  const promedioActual = calcularPromedioDesdeNotas(notas);
  await asignaturaDocRef(uid, idAsignatura).update({ promedioActual });
};

export const agregarNota = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    const idAsignatura = paramString(req.params.idAsignatura);

    if (!uid) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (!idAsignatura) {
      res.status(400).json({ error: 'ID de asignatura requerido' });
      return;
    }

    const asignaturaSnap = await asignaturaDocRef(uid, idAsignatura).get();

    if (!asignaturaSnap.exists) {
      res.status(404).json({ error: 'Asignatura no encontrada' });
      return;
    }

    const { nombre, nota, porcentaje } = req.body;

    if (!nombre || nota === undefined || porcentaje === undefined) {
      res.status(400).json({ error: 'nombre, nota y porcentaje son obligatorios' });
      return;
    }

    const notaNumerica = Number(nota);
    const porcentajeNumerico = Number(porcentaje);

    if (Number.isNaN(notaNumerica) || Number.isNaN(porcentajeNumerico)) {
      res.status(400).json({ error: 'nota y porcentaje deben ser valores numéricos' });
      return;
    }

    const docRef = await notasRef(uid, idAsignatura).add({
      nombre,
      nota: notaNumerica,
      porcentaje: porcentajeNumerico,
    });

    await actualizarPromedioAsignatura(uid, idAsignatura);

    const notaCreada: Nota = {
      id: docRef.id,
      nombre,
      nota: notaNumerica,
      porcentaje: porcentajeNumerico,
    };

    res.status(201).json({ message: 'Nota agregada exitosamente', data: notaCreada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al agregar la nota' });
  }
};

export const obtenerNotas = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    const idAsignatura = paramString(req.params.idAsignatura);

    if (!uid) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (!idAsignatura) {
      res.status(400).json({ error: 'ID de asignatura requerido' });
      return;
    }

    const asignaturaSnap = await asignaturaDocRef(uid, idAsignatura).get();

    if (!asignaturaSnap.exists) {
      res.status(404).json({ error: 'Asignatura no encontrada' });
      return;
    }

    const snapshot = await notasRef(uid, idAsignatura).get();
    const notas: Nota[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre as string,
        nota: data.nota as number,
        porcentaje: data.porcentaje as number,
      };
    });

    res.status(200).json(notas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las notas' });
  }
};

export const eliminarNota = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid = req.user?.uid;
    const idAsignatura = paramString(req.params.idAsignatura);
    const idNota = paramString(req.params.idNota);

    if (!uid) {
      res.status(401).json({ error: 'Usuario no autenticado' });
      return;
    }

    if (!idAsignatura || !idNota) {
      res.status(400).json({ error: 'ID de asignatura y de nota son requeridos' });
      return;
    }

    const notaRef = notasRef(uid, idAsignatura).doc(idNota);
    const notaSnap = await notaRef.get();

    if (!notaSnap.exists) {
      res.status(404).json({ error: 'Nota no encontrada' });
      return;
    }

    await notaRef.delete();
    await actualizarPromedioAsignatura(uid, idAsignatura);

    res.status(200).json({ message: 'Nota eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la nota' });
  }
};
