export interface Usuario {
  uid: string;
  nombres: string;
  correo: string;
  rol: string;
  codigo: string;
  beca_promedio: number;
  beca_cumple: boolean;
  promedio: number;
}

export interface Asignatura {
  id: string;
  descripcion: string;
  creditos: number;
  promedio: number;
  aprueba: boolean;
}

export interface Nota {
  id: string;
  descripcion: string;
  porcentaje: number;
  calificacion: number;
}
