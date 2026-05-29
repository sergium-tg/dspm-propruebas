import { Request, Response } from 'express';
import { db } from '../config/firebaseAdmin';
import { Nota, Asignatura, Usuario } from '../models/types';
import { calcularPromedioDesdeNotas, calcularPromedioGeneral, verificarBeca } from '../services/calculations';

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

const usuarioDocRef = (uid: string) => db.collection('usuarios').doc(uid);

const actualizarDatosGlobales = async (uid: string): Promise<void> => {
  const asignaturasSnap = await db.collection('usuarios').doc(uid).collection('asignaturas').get();
  const asignaturas: Asignatura[] = asignaturasSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      descripcion: (data.descripcion || data.nombre) as string,
      creditos: data.creditos as number,
      promedio: data.promedio as number,
      aprueba: data.aprueba as boolean,
    };
  });

  const usuarioSnap = await usuarioDocRef(uid).get();
  const usuarioData = usuarioSnap.data() as Usuario;
  
  const promedioGeneral = calcularPromedioGeneral(asignaturas);
  const becaPromedio = usuarioData.beca_promedio || 4.0;
  const beca_cumple = verificarBeca(promedioGeneral, becaPromedio);

  await usuarioDocRef(uid).update({
    promedio: promedioGeneral,
    beca_cumple,
  });
};

const actualizarPromedioAsignatura = async (uid: string, idAsignatura: string): Promise<void> => {
  const snapshot = await notasRef(uid, idAsignatura).get();
  const notas: Nota[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      descripcion: data.descripcion as string,
      calificacion: data.calificacion as number,
      porcentaje: data.porcentaje as number,
    };
  });

  const promedio = calcularPromedioDesdeNotas(notas);
  const aprueba = promedio >= 3.0; // Asumiendo 3.0 como nota de aprobación
  await asignaturaDocRef(uid, idAsignatura).update({ promedio, aprueba });
  
  // Después de actualizar la asignatura, actualizamos los datos globales del usuario
  await actualizarDatosGlobales(uid);
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

    const { descripcion, calificacion, porcentaje } = req.body;

    if (!descripcion || calificacion === undefined || porcentaje === undefined) {
      res.status(400).json({ error: 'descripcion, calificacion y porcentaje son obligatorios' });
      return;
    }

    const calificacionNumerica = Number(calificacion);
    const porcentajeNumerico = Number(porcentaje);

    if (Number.isNaN(calificacionNumerica) || Number.isNaN(porcentajeNumerico)) {
      res.status(400).json({ error: 'calificacion y porcentaje deben ser valores numéricos' });
      return;
    }

    const docRef = await notasRef(uid, idAsignatura).add({
      descripcion,
      calificacion: calificacionNumerica,
      porcentaje: porcentajeNumerico,
    });

    await actualizarPromedioAsignatura(uid, idAsignatura);

    const notaCreada: Nota = {
      id: docRef.id,
      descripcion,
      calificacion: calificacionNumerica,
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
        descripcion: data.descripcion as string,
        calificacion: data.calificacion as number,
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

export const actualizarNota = async (req: Request, res: Response): Promise<void> => {
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

    const { descripcion, calificacion, porcentaje } = req.body;

    const updates: any = {};
    if (descripcion !== undefined) updates.descripcion = descripcion;
    if (calificacion !== undefined) updates.calificacion = Number(calificacion);
    if (porcentaje !== undefined) updates.porcentaje = Number(porcentaje);

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No se proporcionaron campos para actualizar' });
      return;
    }

    const notaRef = notasRef(uid, idAsignatura).doc(idNota);
    const notaSnap = await notaRef.get();

    if (!notaSnap.exists) {
      res.status(404).json({ error: 'Nota no encontrada' });
      return;
    }

    await notaRef.update(updates);
    await actualizarPromedioAsignatura(uid, idAsignatura);

    res.status(200).json({ message: 'Nota actualizada exitosamente', data: updates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la nota' });
  }
};
