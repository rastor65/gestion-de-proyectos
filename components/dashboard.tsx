"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, FolderOpen, TrendingUp } from "lucide-react"

interface DashboardStats {
  totalEstudiantes: number
  totalDocentes: number
  totalProyectos: number
  projectsByStatus: { [key: string]: number }
  projectsBySubject: { [key: string]: number }
  projectsByPeriod: { [key: string]: number }
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [estudiantesRes, docentesRes, proyectosRes] = await Promise.all([
          fetch("/api/estudiantes"),
          fetch("/api/docentes"),
          fetch("/api/proyectos"),
        ])

        const estudiantes = await estudiantesRes.json()
        const docentes = await docentesRes.json()
        const proyectos = await proyectosRes.json()

        const projectsByStatus: { [key: string]: number } = {
          "Sin estado": 0,
          Formulación: 0,
          "En desarrollo": 0,
          Aprobado: 0,
          Finalizado: 0,
          Archivado: 0,
        }

        proyectos.forEach((p: any) => {
          const status = p.estado || "Sin estado"
          projectsByStatus[status] = (projectsByStatus[status] || 0) + 1
        })

        const projectsBySubject: { [key: string]: number } = {}
        proyectos.forEach((p: any) => {
          projectsBySubject[p.asignatura] = (projectsBySubject[p.asignatura] || 0) + 1
        })

        const projectsByPeriod: { [key: string]: number } = {}
        proyectos.forEach((p: any) => {
          projectsByPeriod[p.periodo] = (projectsByPeriod[p.periodo] || 0) + 1
        })

        setStats({
          totalEstudiantes: estudiantes.length,
          totalDocentes: docentes.length,
          totalProyectos: proyectos.length,
          projectsByStatus,
          projectsBySubject,
          projectsByPeriod,
        })
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return null

  const projectsPerStudent = stats.totalEstudiantes > 0 ? (stats.totalProyectos / stats.totalEstudiantes).toFixed(1) : 0

  const statCards = [
    { title: "Estudiantes", value: stats.totalEstudiantes, icon: Users, color: "bg-blue-100" },
    { title: "Docentes", value: stats.totalDocentes, icon: BookOpen, color: "bg-cyan-100" },
    { title: "Proyectos", value: stats.totalProyectos, icon: FolderOpen, color: "bg-green-100" },
    { title: "Proyectos/Estudiante", value: projectsPerStudent, icon: TrendingUp, color: "bg-orange-100" },
  ]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium text-muted-foreground">{card.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{card.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Proyectos por estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.projectsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{status}</span>
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects by Period */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribución por período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.projectsByPeriod)
                .sort()
                .map(([period, count]) => (
                  <div key={period} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{period}</span>
                    <Badge variant="secondary" className="text-base px-3 py-1">
                      {count}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects by Subject */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribución por asignatura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(stats.projectsBySubject)
              .sort((a, b) => b[1] - a[1])
              .map(([subject, count]) => (
                <div key={subject} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium text-foreground">{subject}</span>
                  <Badge className="text-base px-3 py-1">{count}</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
