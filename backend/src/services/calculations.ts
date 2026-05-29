import { Nota } from '../models/types';

export const calcularPromedioDesdeNotas = (notas: Nota[]): number => {
  let promedio = 0;

  notas.forEach((n) => {
    promedio += n.calificacion * (n.porcentaje / 100);
  });

  return Math.round(promedio * 100) / 100;
};
