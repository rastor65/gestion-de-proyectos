"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, FolderOpen, TrendingUp, BarChart3 } from "lucide-react"
import type { DashboardStats } from "@/lib/types"
import type { Proyecto, Estudiante, Docente } from "@/lib/types"

export default function DashboardView() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [estudiantesRes, docentesRes, proyectosRes] = await Promise.all([
          fetch("/api/estudiantes"),
          fetch("/api/docentes"),
          fetch("/api/proyectos"),
        ])

        if (!estudiantesRes.ok || !docentesRes.ok || !proyectosRes.ok) {
          throw new Error("Failed to fetch data")
        }

        const estudiantes: Estudiante[] = await estudiantesRes.json()
        const docentes: Docente[] = await docentesRes.json()
        const proyectos: Proyecto[] = await proyectosRes.json()

        // Calculate statistics
        const projectsByStatus: Record<string, number> = {
          Formulación: 0,
          "En desarrollo": 0,
          Aprobado: 0,
          Finalizado: 0,
          Archivado: 0,
          "Sin estado": 0,
        }

        const projectsBySubject: Record<string, number> = {}
        const projectsByPeriod: Record<string, number> = {}

        proyectos.forEach((p) => {
          // Count by status
          if (p.estado) {
            projectsByStatus[p.estado] = (projectsByStatus[p.estado] || 0) + 1
          } else {
            projectsByStatus["Sin estado"] = (projectsByStatus["Sin estado"] || 0) + 1
          }

          // Count by subject
          projectsBySubject[p.asignatura] = (projectsBySubject[p.asignatura] || 0) + 1

          // Count by period
          projectsByPeriod[p.periodo] = (projectsByPeriod[p.periodo] || 0) + 1
        })

        const totalProyectos = proyectos.length
        const totalEstudiantes = estudiantes.length
        const totalDocentes = docentes.length

        setStats({
          totalEstudiantes,
          totalDocentes,
          totalProyectos,
          promedio: totalEstudiantes > 0 ? totalProyectos / totalEstudiantes : 0,
          projectsByStatus,
          projectsBySubject,
          projectsByPeriod,
        })
        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Error al cargar los datos del dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Cargando datos desde Google Sheets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">No hay datos disponibles</p>
      </div>
    )
  }

  const statusBadgeColors = {
    Formulación: "bg-yellow-100 text-yellow-800 border-yellow-200",
    "En desarrollo": "bg-blue-100 text-blue-800 border-blue-200",
    Aprobado: "bg-green-100 text-green-800 border-green-200",
    Finalizado: "bg-purple-100 text-purple-800 border-purple-200",
    Archivado: "bg-gray-100 text-gray-800 border-gray-200",
    "Sin estado": "bg-muted text-muted-foreground border-border",
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Resumen general de proyectos, docentes y estudiantes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Estudiantes</CardTitle>
            <div className="bg-blue-100 p-2.5 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalEstudiantes}</div>
            <p className="text-xs text-muted-foreground mt-1">Registrados en el programa</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Docentes</CardTitle>
            <div className="bg-green-100 p-2.5 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalDocentes}</div>
            <p className="text-xs text-muted-foreground mt-1">Miembros del equipo</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Proyectos</CardTitle>
            <div className="bg-purple-100 p-2.5 rounded-lg">
              <FolderOpen className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalProyectos}</div>
            <p className="text-xs text-muted-foreground mt-1">Proyectos activos</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Promedio</CardTitle>
            <div className="bg-orange-100 p-2.5 rounded-lg">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.promedio.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Proyectos por estudiante</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-border/50">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <CardTitle>Proyectos por Estado</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {Object.entries(stats.projectsByStatus).map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium text-foreground">{status}</span>
                  <Badge
                    variant="secondary"
                    className={`font-semibold ${statusBadgeColors[status as keyof typeof statusBadgeColors]}`}
                  >
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-border/50">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              <CardTitle>Proyectos por Período</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {Object.entries(stats.projectsByPeriod)
                .sort(([periodA], [periodB]) => periodB.localeCompare(periodA))
                .map(([period, count]) => (
                  <div
                    key={period}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground">{period}</span>
                    <Badge variant="secondary" className="font-semibold">
                      {count}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 border-border/50">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-secondary" />
            <CardTitle>Proyectos por Asignatura</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(stats.projectsBySubject).map(([subject, count]) => (
              <div
                key={subject}
                className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
              >
                <p className="text-sm font-medium text-foreground truncate">{subject}</p>
                <p className="text-2xl font-bold text-primary mt-2">{count}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
