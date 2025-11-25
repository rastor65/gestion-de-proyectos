"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import type { Proyecto } from "@/components/modals/proyecto-modal"

// Tipos mínimos para estudiantes y docentes según tus APIs
interface Estudiante {
  id?: string
  codigo: string
  nombreCompleto: string
  correo: string
}

interface Docente {
  id?: string
  nombreCompleto: string
  asignatura: string
  correo: string
}

// Ahora sí, incluimos las nuevas propiedades
interface DashboardStats {
  totalEstudiantes: number
  totalDocentes: number
  totalProyectos: number
  promedio: number
  projectsByStatus: { name: string; value: number }[]
  projectsBySubject: { name: string; value: number }[]
  projectsByPeriod: { name: string; value: number }[]
}

const COLORS = ["#0e7490", "#22c55e", "#f59e0b", "#8b5cf6", "#0f172a", "#ef4444", "#14b8a6"]

export default function DashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [estRes, docRes, projRes] = await Promise.all([
          fetch("/api/estudiantes"),
          fetch("/api/docentes"),
          fetch("/api/proyectos"),
        ])

        const [estudiantes, docentes, proyectos]: [Estudiante[], Docente[], Proyecto[]] = await Promise.all([
          estRes.json(),
          docRes.json(),
          projRes.json(),
        ])

        const totalEstudiantes = estudiantes.length
        const totalDocentes = docentes.length
        const totalProyectos = proyectos.length

        // Agrupación por estado
        const statusMap: Record<string, number> = {}
        // Agrupación por asignatura
        const subjectMap: Record<string, number> = {}
        // Agrupación por periodo
        const periodMap: Record<string, number> = {}

        proyectos.forEach((p) => {
          const estado = (p.estado || "Sin estado").toString()
          const asignatura = (p.asignatura || "Sin asignatura").toString()
          const periodo = (p.periodo || "Sin período").toString()

          statusMap[estado] = (statusMap[estado] || 0) + 1
          subjectMap[asignatura] = (subjectMap[asignatura] || 0) + 1
          periodMap[periodo] = (periodMap[periodo] || 0) + 1
        })

        const projectsByStatus = Object.entries(statusMap).map(([name, value]) => ({ name, value }))
        const projectsBySubject = Object.entries(subjectMap).map(([name, value]) => ({ name, value }))
        const projectsByPeriod = Object.entries(periodMap).map(([name, value]) => ({ name, value }))

        setStats({
          totalEstudiantes,
          totalDocentes,
          totalProyectos,
          promedio: totalEstudiantes > 0 ? totalProyectos / totalEstudiantes : 0,
          projectsByStatus,
          projectsBySubject,
          projectsByPeriod,
        })
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const renderSkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderSkeletonCharts = () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (loading || !stats) {
    return (
      <div className="space-y-6">
        {renderSkeletonCards()}
        {renderSkeletonCharts()}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Estudiantes</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">{stats.totalEstudiantes}</div>
            <p className="text-xs text-muted-foreground mt-1">Registrados en el sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Docentes</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">{stats.totalDocentes}</div>
            <p className="text-xs text-muted-foreground mt-1">Vinculados a proyectos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">Proyectos</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">{stats.totalProyectos}</div>
            <p className="text-xs text-muted-foreground mt-1">Proyectos de investigación registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-muted-foreground">
              Promedio proyectos / estudiante
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold">{stats.promedio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Relación global del periodo</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Proyectos por estado */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Proyectos por estado</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {stats.projectsByStatus.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay datos de estado de proyectos.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.projectsByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {stats.projectsByStatus.map((entry, index) => (
                      <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Proyectos por asignatura */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Proyectos por asignatura</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {stats.projectsBySubject.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay proyectos agrupados por asignatura.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.projectsBySubject}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {stats.projectsBySubject.map((entry, index) => (
                      <Cell key={`cell-subject-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Proyectos por período */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base md:text-lg">Proyectos por período</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {stats.projectsByPeriod.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay proyectos agrupados por período.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.projectsByPeriod}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {stats.projectsByPeriod.map((entry, index) => (
                      <Cell key={`cell-period-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
