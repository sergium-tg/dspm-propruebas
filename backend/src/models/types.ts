export interface Usuario {
  uid: string;
  nombre: string;
  correo: string;
  rol: string;
  codigo?: string;
  carrera?: string;
}

export interface Asignatura {
  id: string;
  nombre: string;
  profesor: string;
  periodo: string;
  promedioActual: number;
}

export interface Nota {
  id: string;
  nombre: string;
  nota: number;
  porcentaje: number;
}
