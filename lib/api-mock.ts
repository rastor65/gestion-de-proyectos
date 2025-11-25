// Mock data for demonstration purposes
// Replace with actual API calls in production

export interface Estudiante {
  codigo: string
  nombreCompleto: string
  correo?: string
}

export interface Docente {
  id: string
  asignatura: string
  apellidos: string
  nombres: string
  nombreCompleto: string
  correo: string
  telefono: string
  tipoVinculacion: string
}

export interface Proyecto {
  id: string
  periodo: string
  asignatura: string
  docente: string
  estudiantes: string
  titulo: string
  link?: string
  estado: string
}

// Mock Estudiantes
export const mockEstudiantes: Estudiante[] = [
  { codigo: "2024001", nombreCompleto: "Juan Pérez García", correo: "juan.perez@uniguajira.edu.co" },
  { codigo: "2024002", nombreCompleto: "María García López", correo: "maria.garcia@uniguajira.edu.co" },
  { codigo: "2024003", nombreCompleto: "Carlos Rodríguez Martínez", correo: "carlos.rodriguez@uniguajira.edu.co" },
  { codigo: "2024004", nombreCompleto: "Ana Martínez Ruiz", correo: "ana.martinez@uniguajira.edu.co" },
  { codigo: "2024005", nombreCompleto: "Luis Fernández González", correo: "luis.fernandez@uniguajira.edu.co" },
]

// Mock Docentes
export const mockDocentes: Docente[] = [
  {
    id: "1",
    asignatura: "METODOLOGIA DE LA INVESTIGACION",
    apellidos: "González",
    nombres: "Juan",
    nombreCompleto: "Juan González",
    correo: "juan.gonzalez@uniguajira.edu.co",
    telefono: "3001234567",
    tipoVinculacion: "Planta",
  },
  {
    id: "2",
    asignatura: "FORMULACIÓN Y EVALUACIÓN DE PROYECTOS",
    apellidos: "López",
    nombres: "María",
    nombreCompleto: "María López",
    correo: "maria.lopez@uniguajira.edu.co",
    telefono: "3007654321",
    tipoVinculacion: "Ocasional",
  },
  {
    id: "3",
    asignatura: "PROYECTO I",
    apellidos: "Ruiz",
    nombres: "Carlos",
    nombreCompleto: "Carlos Ruiz",
    correo: "carlos.ruiz@uniguajira.edu.co",
    telefono: "3005551234",
    tipoVinculacion: "Catedrático",
  },
]

// Mock Proyectos
export const mockProyectos: Proyecto[] = [
  {
    id: "1",
    periodo: "2025-1",
    asignatura: "METODOLOGIA DE LA INVESTIGACION",
    docente: "Juan González",
    estudiantes: "Juan Pérez García, María García López",
    titulo: "Análisis de metodologías ágiles en desarrollo de software",
    link: "https://drive.google.com/drive/folders/ejemplo1",
    estado: "En desarrollo",
  },
  {
    id: "2",
    periodo: "2025-1",
    asignatura: "FORMULACIÓN Y EVALUACIÓN DE PROYECTOS",
    docente: "María López",
    estudiantes: "Carlos Rodríguez Martínez",
    titulo: "Evaluación económica de un proyecto de infraestructura TI",
    link: "https://github.com/ejemplo2",
    estado: "Aprobado",
  },
  {
    id: "3",
    periodo: "2025-2",
    asignatura: "PROYECTO I",
    docente: "Carlos Ruiz",
    estudiantes: "Ana Martínez Ruiz, Luis Fernández González",
    titulo: "Plataforma de gestión académica basada en IA",
    link: "",
    estado: "Formulación",
  },
]
