"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Plus } from "lucide-react"
import EstudianteModal, { Estudiante } from "@/components/modals/estudiante-modal"


export default function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [filteredEstudiantes, setFilteredEstudiantes] = useState<Estudiante[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingEstudiante, setEditingEstudiante] = useState<Estudiante | null>(null)

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/estudiantes")
        const data = await res.json()
        setEstudiantes(data)
        setFilteredEstudiantes(data)
      } catch (error) {
        console.error("Error fetching estudiantes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEstudiantes()
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = estudiantes.filter(
      (e) =>
        e.codigo.toLowerCase().includes(term.toLowerCase()) ||
        e.nombreCompleto.toLowerCase().includes(term.toLowerCase()) ||
        e.correo?.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredEstudiantes(filtered)
  }

  const handleSave = async (estudiante: Estudiante) => {
    try {
      const method = editingEstudiante ? "PUT" : "POST"
      const res = await fetch("/api/estudiantes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(estudiante),
      })

      if (res.ok) {
        const newData = await res.json()
        const newEstudiantes = editingEstudiante
          ? estudiantes.map((e) => (e.codigo === editingEstudiante.codigo ? newData : e))
          : [...estudiantes, newData]
        setEstudiantes(newEstudiantes)
        setFilteredEstudiantes(newEstudiantes)
        setShowModal(false)
        setEditingEstudiante(null)
      }
    } catch (error) {
      console.error("Error saving estudiante:", error)
    }
  }

  const handleDelete = async (codigo: string) => {
    if (!confirm("¿Está seguro de que desea eliminar este estudiante?")) return

    try {
      const res = await fetch(`/api/estudiantes?codigo=${codigo}`, { method: "DELETE" })
      if (res.ok) {
        const newEstudiantes = estudiantes.filter((e) => e.codigo !== codigo)
        setEstudiantes(newEstudiantes)
        setFilteredEstudiantes(newEstudiantes)
      }
    } catch (error) {
      console.error("Error deleting estudiante:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl md:text-2xl">Estudiantes</CardTitle>
            <Button
              onClick={() => {
                setEditingEstudiante(null)
                setShowModal(true)
              }}
              className="bg-cyan-500 hover:bg-cyan-600 w-full md:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo estudiante
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Buscar por código, nombre o correo..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="text-base"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Código</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Nombre completo</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Correo</th>
                    <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEstudiantes.map((estudiante) => (
                    <tr key={estudiante.codigo} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2 font-medium">{estudiante.codigo}</td>
                      <td className="py-3 px-2">{estudiante.nombreCompleto}</td>
                      <td className="py-3 px-2 text-muted-foreground">{estudiante.correo || "-"}</td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingEstudiante(estudiante)
                            setShowModal(true)
                          }}
                          className="inline-flex items-center justify-center p-2 hover:bg-muted rounded"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4 text-cyan-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(estudiante.codigo)}
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

      <EstudianteModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open)
          if (!open) {
            setEditingEstudiante(null)
          }
        }}
        onSave={handleSave}   // tu función que hace POST/PUT a /api/estudiantes
        initialData={editingEstudiante}
      />
    </div>
  )
}
