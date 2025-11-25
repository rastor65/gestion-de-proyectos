"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2, Plus } from "lucide-react"
import DocenteModal from "@/components/modals/docente-modal"

interface Docente {
  id?: string
  asignatura: string
  apellidos: string
  nombres: string
  nombreCompleto: string
  correo: string
  telefono: string
  tipoVinculacion: string
}

export default function Docentes() {
  const [docentes, setDocentes] = useState<Docente[]>([])
  const [filteredDocentes, setFilteredDocentes] = useState<Docente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingDocente, setEditingDocente] = useState<Docente | null>(null)

  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/docentes")
        const data = await res.json()
        setDocentes(data)
        setFilteredDocentes(data)
      } catch (error) {
        console.error("Error fetching docentes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocentes()
  }, [])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = docentes.filter(
      (d) =>
        d.nombreCompleto.toLowerCase().includes(term.toLowerCase()) ||
        d.correo.toLowerCase().includes(term.toLowerCase()) ||
        d.asignatura.toLowerCase().includes(term.toLowerCase()),
    )
    setFilteredDocentes(filtered)
  }

  const handleSave = async (docente: Docente) => {
    try {
      const method = editingDocente ? "PUT" : "POST"
      const res = await fetch("/api/docentes", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docente),
      })

      if (res.ok) {
        const newData = await res.json()
        const newDocentes = editingDocente
          ? docentes.map((d) => (d.id === editingDocente.id ? newData : d))
          : [...docentes, newData]
        setDocentes(newDocentes)
        setFilteredDocentes(newDocentes)
        setShowModal(false)
        setEditingDocente(null)
      }
    } catch (error) {
      console.error("Error saving docente:", error)
    }
  }

  const handleDelete = async (id: string | undefined) => {
    if (!id || !confirm("¿Está seguro de que desea eliminar este docente?")) return

    try {
      const res = await fetch(`/api/docentes?id=${id}`, { method: "DELETE" })
      if (res.ok) {
        const newDocentes = docentes.filter((d) => d.id !== id)
        setDocentes(newDocentes)
        setFilteredDocentes(newDocentes)
      }
    } catch (error) {
      console.error("Error deleting docente:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle className="text-xl md:text-2xl">Docentes</CardTitle>
            <Button
              onClick={() => {
                setEditingDocente(null)
                setShowModal(true)
              }}
              className="bg-cyan-500 hover:bg-cyan-600 w-full md:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo docente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Input
              placeholder="Buscar por nombre, correo o asignatura..."
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
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Asignatura</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Nombre completo</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Correo</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Teléfono</th>
                    <th className="text-left py-3 px-2 font-semibold text-muted-foreground">Vinculación</th>
                    <th className="text-right py-3 px-2 font-semibold text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocentes.map((docente) => (
                    <tr key={docente.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2 font-medium text-cyan-600">{docente.asignatura}</td>
                      <td className="py-3 px-2">{docente.nombreCompleto}</td>
                      <td className="py-3 px-2 text-muted-foreground text-sm">{docente.correo}</td>
                      <td className="py-3 px-2 text-muted-foreground">{docente.telefono}</td>
                      <td className="py-3 px-2">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          {docente.tipoVinculacion}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingDocente(docente)
                            setShowModal(true)
                          }}
                          className="inline-flex items-center justify-center p-2 hover:bg-muted rounded"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4 text-cyan-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(docente.id)}
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

      <DocenteModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setEditingDocente(null)
        }}
        onSave={handleSave}
        initialData={editingDocente}
      />
    </div>
  )
}
