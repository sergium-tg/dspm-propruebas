import { db } from '../config/firebaseAdmin';
import { Asignatura, Usuario } from '../models/types';
import { calcularPromedioGeneral, verificarBeca } from './calculations';

export const actualizarDatosGlobalesUsuario = async (uid: string): Promise<void> => {
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

  const usuarioRef = db.collection('usuarios').doc(uid);
  const usuarioSnap = await usuarioRef.get();
  
  if (!usuarioSnap.exists) return;
  
  const usuarioData = usuarioSnap.data() as Usuario;
  
  const promedioGeneral = calcularPromedioGeneral(asignaturas);
  const becaPromedio = usuarioData.beca_promedio || 4.0;
  const beca_cumple = verificarBeca(promedioGeneral, becaPromedio);

  await usuarioRef.update({
    promedio: promedioGeneral,
    beca_cumple,
  });
};
