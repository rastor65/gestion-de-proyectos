export interface Estudiante {
  id?: string
  codigo: string
  nombreCompleto: string
  correo: string
}

export interface Docente {
  id?: string
  asignatura: string
  apellidos: string
  nombres: string
  nombreCompleto: string
  correo: string
  telefono: string
  tipoVinculacion: "Catedrático" | "Ocasional" | "Planta"
}

export interface Proyecto {
  id?: string
  periodo: string
  asignatura: string
  docente: string
  estudiantes: string[]
  titulo: string
  link: string
  estado: "Formulación" | "En desarrollo" | "Aprobado" | "Finalizado" | "Archivado" | ""
}

export interface DashboardStats {
  totalEstudiantes: number
  totalDocentes: number
  totalProyectos: number
  promedio: number
}
