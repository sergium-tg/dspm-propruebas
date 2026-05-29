export interface Usuario {
  uid: string;
  nombres: string;
  correo: string;
  rol: string;
  codigo: string;
}

export interface Asignatura {
  id: string;
  nombre: string;
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
