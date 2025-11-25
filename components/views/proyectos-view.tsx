"use client"

import { useState, useEffect } from "react"
import { Pencil, Trash2, Plus, ExternalLink, Search, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const PROJECT_STATUSES = ["Formulación", "En desarrollo", "Aprobado", "Finalizado", "Archivado"]
const PERIODOS = ["2025-1", "2025-2", "2026-1", "2026-2", "2027-1", "2027-2"]
const ASIGNATURAS = [
  "METODOLOGIA DE LA INVESTIGACION",
  "FORMULACIÓN Y EVALUACIÓN DE PROYECTOS",
  "PROYECTO I",
  "PROYECTO II",
]

const statusColors = {
  Formulación: "bg-yellow-100 text-yellow-800",
  "En desarrollo": "bg-blue-100 text-blue-800",
  Aprobado: "bg-green-100 text-green-800",
  Finalizado: "bg-purple-100 text-purple-800",
  Archivado: "bg-gray-100 text-gray-800",
}

interface Proyecto {
  periodo: string
  asignatura: string
  docente: string
  estudiantes: string[]
  titulo: string
  link: string
  estado: string
}

export default function ProyectosView() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([])
  const [estudiantes, setEstudiantes] = useState<any[]>([])
  const [docentes, setDocentes] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("todos")
  const [selectedProyecto, setSelectedProyecto] = useState<Proyecto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titulo: "",
    asignatura: "",
    estado: "Formulación",
    periodo: "",
    link: "",
    docente: "",
    estudiantes: "",
  })

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [proyResp, estudResp, docResp] = await Promise.all([
        fetch("/api/proyectos"),
        fetch("/api/estudiantes"),
        fetch("/api/docentes"),
      ])

      if (!proyResp.ok || !estudResp.ok || !docResp.ok) throw new Error("Error fetching data")

      const [proyData, estudData, docData] = await Promise.all([proyResp.json(), estudResp.json(), docResp.json()])

      setProyectos(proyData)
      setEstudiantes(estudData)
      setDocentes(docData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data")
      console.error("[v0] Error fetching:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = proyectos.filter((p) => {
    const matchSearch =
      p.titulo.toLowerCase().includes(search.toLowerCase()) || p.asignatura.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === "todos" || p.estado === filterStatus
    return matchSearch && matchStatus
  })

  const handleAdd = () => {
    setSelectedProyecto(null)
    setFormData({
      titulo: "",
      asignatura: "",
      estado: "Formulación",
      periodo: "",
      link: "",
      docente: "",
      estudiantes: "",
    })
    setIsModalOpen(true)
  }

  const handleEdit = (proyecto: Proyecto) => {
    setSelectedProyecto(proyecto)
    setFormData({
      titulo: proyecto.titulo,
      asignatura: proyecto.asignatura,
      estado: proyecto.estado,
      periodo: proyecto.periodo,
      link: proyecto.link,
      docente: proyecto.docente,
      estudiantes: proyecto.estudiantes.join(", "),
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (titulo: string) => {
    try {
      const response = await fetch("/api/proyectos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo }),
      })
      if (!response.ok) throw new Error("Error deleting project")
      await fetchAllData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting project")
      console.error("[v0] Error deleting:", err)
    }
  }

  const handleSave = async () => {
    if (!formData.titulo || !formData.asignatura || !formData.periodo) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const estudiantesList = formData.estudiantes
        .split(",")
        .map((e) => e.trim())
        .filter((e) => e)

      const method = selectedProyecto ? "PUT" : "POST"
      const response = await fetch("/api/proyectos", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: formData.titulo,
          periodo: formData.periodo,
          asignatura: formData.asignatura,
          docente: formData.docente,
          estudiantes: estudiantesList,
          link: formData.link,
          estado: formData.estado,
        }),
      })

      if (!response.ok) throw new Error(`Error ${selectedProyecto ? "updating" : "creating"} project`)
      await fetchAllData()
      setIsModalOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving project")
      console.error("[v0] Error saving:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportCSV = () => {
    const headers = ["Titulo", "Estudiantes", "Docente", "Estado", "Asignatura", "Período"]
    const csv = [
      headers.join(","),
      ...filtered.map((p) =>
        [`"${p.titulo}"`, `"${p.estudiantes.join("; ")}"`, p.docente, p.estado, p.asignatura, p.periodo].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "proyectos.csv"
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Proyectos</h1>
          <p className="text-muted-foreground mt-1">Gestiona todos los proyectos de investigación</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            disabled={isLoading}
            className="shadow-sm hover:shadow-md transition-shadow bg-transparent"
          >
            Exportar CSV
          </Button>
          <Button
            onClick={handleAdd}
            className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            disabled={isLoading}
          >
            <Plus className="w-5 h-5" />
            Agregar Proyecto
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <span className="text-destructive">{error}</span>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="border-b border-border pb-4 space-y-4">
          <div className="flex items-center gap-2 bg-input rounded-lg px-3 py-2 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título o asignatura..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent focus:outline-none focus:ring-0 focus:ring-offset-0"
              disabled={isLoading}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="max-w-xs select-modern" disabled={isLoading}>
              <SelectValue placeholder="Filtrar por estado..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              {PROJECT_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-muted-foreground mt-3">Cargando proyectos...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-semibold text-foreground">Título</TableHead>
                  <TableHead className="font-semibold text-foreground">Asignatura</TableHead>
                  <TableHead className="font-semibold text-foreground">Estado</TableHead>
                  <TableHead className="font-semibold text-foreground">Período</TableHead>
                  <TableHead className="font-semibold text-foreground">Enlace</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((proyecto) => (
                  <TableRow key={proyecto.titulo} className="hover:bg-accent/5">
                    <TableCell className="font-medium">{proyecto.titulo}</TableCell>
                    <TableCell className="text-sm">{proyecto.asignatura}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[proyecto.estado as keyof typeof statusColors]}>
                        {proyecto.estado}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{proyecto.periodo}</TableCell>
                    <TableCell>
                      {proyecto.link && (
                        <a
                          href={proyecto.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(proyecto)}
                        className="hover:bg-accent/20"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(proyecto.titulo)}
                        className="hover:bg-destructive/20"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProyecto ? "Editar Proyecto" : "Agregar Nuevo Proyecto"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="font-semibold">Título</Label>
              <Input
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Título del proyecto"
                disabled={isSaving}
                className="input-modern"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Asignatura</Label>
              <Select
                value={formData.asignatura}
                onValueChange={(value) => setFormData({ ...formData, asignatura: value })}
              >
                <SelectTrigger disabled={isSaving} className="select-modern">
                  <SelectValue placeholder="Selecciona una asignatura..." />
                </SelectTrigger>
                <SelectContent>
                  {ASIGNATURAS.map((asig) => (
                    <SelectItem key={asig} value={asig}>
                      {asig}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Período</Label>
              <Select value={formData.periodo} onValueChange={(value) => setFormData({ ...formData, periodo: value })}>
                <SelectTrigger disabled={isSaving} className="select-modern">
                  <SelectValue placeholder="Selecciona un período..." />
                </SelectTrigger>
                <SelectContent>
                  {PERIODOS.map((periodo) => (
                    <SelectItem key={periodo} value={periodo}>
                      {periodo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Docente</Label>
              <Select value={formData.docente} onValueChange={(value) => setFormData({ ...formData, docente: value })}>
                <SelectTrigger disabled={isSaving || docentes.length === 0} className="select-modern">
                  <SelectValue placeholder="Selecciona un docente..." />
                </SelectTrigger>
                <SelectContent>
                  {docentes.map((doc) => (
                    <SelectItem key={doc.nombreCompleto} value={doc.nombreCompleto}>
                      {doc.nombreCompleto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Estudiantes (Códigos separados por comas)</Label>
              <div className="bg-input rounded-lg p-3 border border-border max-h-40 overflow-y-auto space-y-2">
                {estudiantes.length > 0 ? (
                  <div className="space-y-2">
                    {estudiantes.map((est) => (
                      <button
                        key={est.codigo}
                        onClick={() => {
                          const currentList = formData.estudiantes.split(",").map((s) => s.trim())
                          if (currentList.includes(est.codigo)) {
                            setFormData({
                              ...formData,
                              estudiantes: currentList.filter((c) => c !== est.codigo).join(", "),
                            })
                          } else {
                            setFormData({
                              ...formData,
                              estudiantes: [...currentList, est.codigo].filter((c) => c).join(", "),
                            })
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          formData.estudiantes.includes(est.codigo)
                            ? "bg-accent text-accent-foreground"
                            : "bg-background hover:bg-muted text-foreground"
                        }`}
                        disabled={isSaving}
                      >
                        {est.codigo} - {est.nombreCompleto}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No hay estudiantes disponibles</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Estado</Label>
              <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
                <SelectTrigger disabled={isSaving} className="select-modern">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Enlace (opcional)</Label>
              <Input
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://github.com/..."
                type="url"
                disabled={isSaving}
                className="input-modern"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="shadow-lg hover:shadow-xl transition-shadow">
              {isSaving ? "Guardando..." : selectedProyecto ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
