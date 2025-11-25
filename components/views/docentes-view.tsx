"use client"

import { useState, useEffect } from "react"
import { Pencil, Trash2, Plus, Search, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ASIGNATURAS = [
  "METODOLOGIA DE LA INVESTIGACION",
  "FORMULACIÓN Y EVALUACIÓN DE PROYECTOS",
  "PROYECTO I",
  "PROYECTO II",
]

const TIPOS_VINCULACION = ["Catedrático", "Ocasional", "Planta"]

interface Docente {
  asignatura: string
  apellidos: string
  nombres: string
  nombreCompleto: string
  correo: string
  telefono: string
  tipoVinculacion: string
}

export default function DocentesView() {
  const [docentes, setDocentes] = useState<Docente[]>([])
  const [search, setSearch] = useState("")
  const [selectedDocente, setSelectedDocente] = useState<Docente | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    asignatura: "",
    apellidos: "",
    nombres: "",
    tipoVinculacion: "Planta",
    correo: "",
    telefono: "",
  })

  useEffect(() => {
    fetchDocentes()
  }, [])

  const fetchDocentes = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/docentes")
      if (!response.ok) throw new Error("Error fetching teachers")
      const data = await response.json()
      setDocentes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading teachers")
      console.error("[v0] Error fetching docentes:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = docentes.filter(
    (d) =>
      d.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
      d.asignatura.toLowerCase().includes(search.toLowerCase()) ||
      d.correo.toLowerCase().includes(search.toLowerCase()),
  )

  const handleAdd = () => {
    setSelectedDocente(null)
    setFormData({
      nombreCompleto: "",
      asignatura: "",
      apellidos: "",
      nombres: "",
      tipoVinculacion: "Planta",
      correo: "",
      telefono: "",
    })
    setIsModalOpen(true)
  }

  const handleEdit = (docente: Docente) => {
    setSelectedDocente(docente)
    setFormData(docente)
    setIsModalOpen(true)
  }

  const handleDelete = async (nombreCompleto: string) => {
    try {
      const response = await fetch("/api/docentes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreCompleto }),
      })
      if (!response.ok) throw new Error("Error deleting teacher")
      await fetchDocentes()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting teacher")
      console.error("[v0] Error deleting:", err)
    }
  }

  const handleSave = async () => {
    if (!formData.nombreCompleto || !formData.asignatura || !formData.correo) {
      setError("Please fill in all required fields")
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const method = selectedDocente ? "PUT" : "POST"
      const response = await fetch("/api/docentes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error(`Error ${selectedDocente ? "updating" : "creating"} teacher`)
      await fetchDocentes()
      setIsModalOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving teacher")
      console.error("[v0] Error saving:", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Docentes</h1>
          <p className="text-muted-foreground mt-1">Gestiona el equipo docente del programa</p>
        </div>
        <Button
          onClick={handleAdd}
          className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          disabled={isLoading}
        >
          <Plus className="w-5 h-5" />
          Agregar Docente
        </Button>
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
        <CardHeader className="border-b border-border pb-4">
          <div className="flex items-center gap-2 bg-input rounded-lg px-3 py-2 max-w-md">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, asignatura o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 bg-transparent focus:outline-none focus:ring-0 focus:ring-offset-0"
              disabled={isLoading}
            />
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-muted-foreground mt-3">Cargando docentes...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-semibold text-foreground">Nombre</TableHead>
                  <TableHead className="font-semibold text-foreground">Asignatura</TableHead>
                  <TableHead className="font-semibold text-foreground">Tipo</TableHead>
                  <TableHead className="font-semibold text-foreground">Email</TableHead>
                  <TableHead className="font-semibold text-foreground">Teléfono</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((docente) => (
                  <TableRow key={docente.nombreCompleto} className="hover:bg-accent/5">
                    <TableCell className="font-medium">{docente.nombreCompleto}</TableCell>
                    <TableCell className="text-sm">{docente.asignatura}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {docente.tipoVinculacion}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{docente.correo}</TableCell>
                    <TableCell className="text-sm">{docente.telefono}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(docente)}
                        className="hover:bg-accent/20"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(docente.nombreCompleto)}
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
            <DialogTitle>{selectedDocente ? "Editar Docente" : "Agregar Nuevo Docente"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold">Apellidos</Label>
                <Input
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  placeholder="Apellidos"
                  disabled={isSaving}
                  className="input-modern"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Nombres</Label>
                <Input
                  value={formData.nombres}
                  onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                  placeholder="Nombres"
                  disabled={isSaving}
                  className="input-modern"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Nombre Completo</Label>
              <Input
                value={formData.nombreCompleto}
                onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                placeholder="Nombre completo"
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
              <Label className="font-semibold">Tipo de Vinculación</Label>
              <Select
                value={formData.tipoVinculacion}
                onValueChange={(value) => setFormData({ ...formData, tipoVinculacion: value })}
              >
                <SelectTrigger disabled={isSaving} className="select-modern">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_VINCULACION.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Email</Label>
              <Input
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                placeholder="email@example.com"
                type="email"
                disabled={isSaving}
                className="input-modern"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Teléfono</Label>
              <Input
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="3001234567"
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
              {isSaving ? "Guardando..." : selectedDocente ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
