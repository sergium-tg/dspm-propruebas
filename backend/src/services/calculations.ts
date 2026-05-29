import { Nota, Asignatura } from '../models/types';

export const calcularPromedioDesdeNotas = (notas: Nota[]): number => {
  let promedio = 0;

  notas.forEach((n) => {
    promedio += n.calificacion * (n.porcentaje / 100);
  });

  return Math.round(promedio * 100) / 100;
};

export const calcularPromedioGeneral = (asignaturas: Asignatura[]): number => {
  if (asignaturas.length === 0) return 0;
  
  let totalPuntos = 0;
  let totalCreditos = 0;

  asignaturas.forEach((a) => {
    totalPuntos += a.promedio * a.creditos;
    totalCreditos += a.creditos;
  });

  if (totalCreditos === 0) return 0;

  return Math.round((totalPuntos / totalCreditos) * 100) / 100;
};

export const verificarBeca = (promedioGeneral: number, becaPromedio: number): boolean => {
  return promedioGeneral >= becaPromedio;
};
