"use client"

import { useState, useEffect } from "react"
import { Pencil, Trash2, Plus, Search, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface Estudiante {
  codigo: string
  nombreCompleto: string
  correo: string
}

export function EstudiantesView() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [search, setSearch] = useState("")
  const [selectedEstudiante, setSelectedEstudiante] = useState<Estudiante | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({ codigo: "", nombreCompleto: "", correo: "" })

  useEffect(() => {
    fetchEstudiantes()
  }, [])

  const fetchEstudiantes = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("/api/estudiantes")
      if (!response.ok) throw new Error("Error fetching students")
      const data = await response.json()
      setEstudiantes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading students")
      console.error("[v0] Error fetching estudiantes:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filtered = estudiantes.filter(
    (e) =>
      e.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
      e.codigo.includes(search) ||
      e.correo.toLowerCase().includes(search.toLowerCase()),
  )

  const handleAdd = () => {
    setSelectedEstudiante(null)
    setFormData({ codigo: "", nombreCompleto: "", correo: "" })
    setIsModalOpen(true)
  }

  const handleEdit = (estudiante: Estudiante) => {
    setSelectedEstudiante(estudiante)
    setFormData(estudiante)
    setIsModalOpen(true)
  }

  const handleDelete = async (codigo: string) => {
    try {
      const response = await fetch("/api/estudiantes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      })
      if (!response.ok) throw new Error("Error deleting student")
      await fetchEstudiantes()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting student")
      console.error("[v0] Error deleting:", err)
    }
  }

  const handleSave = async () => {
    if (!formData.codigo || !formData.nombreCompleto || !formData.correo) {
      setError("Please fill in all fields")
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const method = selectedEstudiante ? "PUT" : "POST"
      const response = await fetch("/api/estudiantes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error(`Error ${selectedEstudiante ? "updating" : "creating"} student`)
      await fetchEstudiantes()
      setIsModalOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving student")
      console.error("[v0] Error saving:", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Estudiantes</h1>
          <p className="text-muted-foreground mt-1">Gestiona el registro de estudiantes del programa</p>
        </div>
        <Button
          onClick={handleAdd}
          className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
          disabled={isLoading}
        >
          <Plus className="w-5 h-5" />
          Agregar Estudiante
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
              placeholder="Buscar por nombre, código o email..."
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
              <p className="text-muted-foreground mt-3">Cargando estudiantes...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border">
                  <TableHead className="font-semibold text-foreground">Código</TableHead>
                  <TableHead className="font-semibold text-foreground">Nombre</TableHead>
                  <TableHead className="font-semibold text-foreground">Email</TableHead>
                  <TableHead className="text-right font-semibold text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((estudiante) => (
                  <TableRow key={estudiante.codigo} className="hover:bg-accent/5">
                    <TableCell className="font-mono text-sm font-medium text-primary">{estudiante.codigo}</TableCell>
                    <TableCell className="font-medium">{estudiante.nombreCompleto}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{estudiante.correo}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(estudiante)}
                        className="hover:bg-accent/20"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(estudiante.codigo)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEstudiante ? "Editar Estudiante" : "Agregar Nuevo Estudiante"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="font-semibold">Código</Label>
              <Input
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="Ej: 201910001"
                disabled={isSaving || !!selectedEstudiante}
                className="input-modern"
              />
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="shadow-lg hover:shadow-xl transition-shadow">
              {isSaving ? "Guardando..." : selectedEstudiante ? "Actualizar" : "Crear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EstudiantesView
