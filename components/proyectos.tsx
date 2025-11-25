"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus, Download, ExternalLink } from "lucide-react"
import ProyectoModal from "@/components/modals/proyecto-modal"

interface Proyecto {
  id?: string
  periodo: string
  asignatura: string
  docente: string
  estudiantes: string
  titulo: string
  link?: string
  estado: string
}

export default function Proyectos() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [filteredProyectos, setFilteredProyectos] = useState<Proyecto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("todos")
  const [showModal, setShowModal] = useState(false)
  const [editingProyecto, setEditingProyecto] = useState<Proyecto | null>(null)

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/proyectos")
        const data = await res.json()
        setProyectos(data)
        setFilteredProyectos(data)
      } catch (error) {
        console.error("Error fetching proyectos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProyectos()
  }, [])

  const applyFilters = (searchText: string, status: string) => {
    let filtered = proyectos

    if (searchText) {
      filtered = filtered.filter(
        (p) =>
          p.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
          p.estudiantes.toLowerCase().includes(searchText.toLowerCase()) ||
          p.docente.toLowerCase().includes(searchText.toLowerCase()) ||
          p.asignatura.toLowerCase().includes(searchText.toLowerCase()),
      )
    }

    if (status !== "todos") {
      filtered = filtered.filter((p) => (status === "sin-estado" ? !p.estado : p.estado === status))
    }

    setFilteredProyectos(filtered)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    applyFilters(term, filterStatus)
  }

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status)
    applyFilters(searchTerm, status)
  }

  const handleSave = async (proyecto: Proyecto) => {
    try {
      const method = editingProyecto ? "PUT" : "POST"
      const res = await fetch("/api/proyectos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proyecto),
      })

      if (res.ok) {
        const newData = await res.json()
        const newProyectos = editingProyecto
          ? proyectos.map((p) => (p.id === editingProyecto.id ? newData : p))
          : [...proyectos, newData]
        setProyectos(newProyectos)
        applyFilters(searchTerm, filterStatus)
        setShowModal(false)
        setEditingProyecto(null)
      }
    } catch (error) {
      console.error("Error saving proyecto:", error)
    }
  }

  const handleDelete = async (id: string | undefined) => {
    if (!id || !confirm("¿Está seguro de que desea eliminar este proyecto?")) return

    try {
      const res = await fetch(`/api/proyectos?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        const newProyectos = proyectos.filter((p) => p.id !== id)
        setProyectos(newProyectos)
        applyFilters(searchTerm, filterStatus)
      }
    } catch (error) {
      console.error("Error deleting proyecto:", error)
    }
  }

  const handleExport = async () => {
    try {
      const res = await fetch("/api/proyectos/export")
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "proyectos.csv"
      a.click()
    } catch (error) {
      console.error("Error exporting proyectos:", error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      "Sin estado": "bg-gray-100 text-gray-800",
      Formulación: "bg-blue-100 text-blue-800",
      "En desarrollo": "bg-yellow-100 text-yellow-800",
      Aprobado: "bg-green-100 text-green-800",
      Finalizado: "bg-purple-100 text-purple-800",
      Archivado: "bg-gray-200 text-gray-700",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl md:text-2xl">Proyectos</CardTitle>
            <div className="flex flex-col md:flex-row gap-2">
              <Button onClick={handleExport} variant="outline" className="w-full md:w-auto bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Button
                onClick={() => {
                  setEditingProyecto(null)
                  setShowModal(true)
                }}
                className="bg-cyan-500 hover:bg-cyan-600 w-full md:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo proyecto
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Input
              placeholder="Buscar por título, estudiante, docente..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="md:col-span-2 text-base"
            />
            <Select value={filterStatus} onValueChange={handleStatusFilter}>
              <SelectTrigger className="text-base">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="sin-estado">Sin estado</SelectItem>
                <SelectItem value="Formulación">Formulación</SelectItem>
                <SelectItem value="En desarrollo">En desarrollo</SelectItem>
                <SelectItem value="Aprobado">Aprobado</SelectItem>
                <SelectItem value="Finalizado">Finalizado</SelectItem>
                <SelectItem value="Archivado">Archivado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Período</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Asignatura</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Docente</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Estudiantes</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Título</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Estado</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Enlace</th>
                    <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProyectos.map((proyecto) => (
                    <tr key={proyecto.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2 font-medium">{proyecto.periodo}</td>
                      <td className="py-3 px-2 text-cyan-600">{proyecto.asignatura}</td>
                      <td className="py-3 px-2 text-muted-foreground">{proyecto.docente}</td>
                      <td className="py-3 px-2 text-muted-foreground text-xs">{proyecto.estudiantes}</td>
                      <td className="py-3 px-2 max-w-xs truncate">{proyecto.titulo}</td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(proyecto.estado)}`}
                        >
                          {proyecto.estado || "Sin estado"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        {proyecto.link ? (
                          <a
                            href={proyecto.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                          >
                            Ver <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">Sin enlace</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right space-x-1">
                        <button
                          onClick={() => {
                            setEditingProyecto(proyecto)
                            setShowModal(true)
                          }}
                          className="inline-flex items-center justify-center p-2 hover:bg-muted rounded"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4 text-cyan-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(proyecto.id)}
                          className="inline-flex items-center justify-center p-2 hover:bg-muted rounded"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ProyectoModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingProyecto(null)
        }}
        onSave={handleSave}
        initialData={editingProyecto}
      />
    </div>
  )
}
