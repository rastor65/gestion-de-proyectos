"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface Proyecto {
  id?: string
  periodo: string
  asignatura: string
  docente: string
  estudiantes: string
  titulo: string
  link: string
  estado: string
}

export interface ProyectoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (proyecto: Proyecto) => Promise<void> | void
  initialData: Proyecto | null

  // Opcionales para catálogos / combos (si los usas desde proyectos.tsx)
  periodos?: string[]
  asignaturas?: string[]
  estados?: string[]
  docentesOptions?: { id?: string; nombreCompleto: string }[]
  estudiantesOptions?: { id?: string; nombreCompleto: string }[]

  // Index signature para evitar errores si le pasas props extra desde proyectos.tsx
  [key: string]: any
}

export default function ProyectoModal({
  open,
  onOpenChange,
  onSave,
  initialData,
  periodos,
  asignaturas,
  estados,
  docentesOptions,
  estudiantesOptions,
}: ProyectoModalProps) {
  const [formData, setFormData] = useState<Proyecto>({
    id: undefined,
    periodo: "",
    asignatura: "",
    docente: "",
    estudiantes: "",
    titulo: "",
    link: "",
    estado: "",
  })

  // Valores por defecto si no llegan catálogos desde el padre
  const periodoOptions =
    periodos && periodos.length
      ? periodos
      : ["2025-1", "2025-2", "2026-1", "2026-2", "2027-1", "2027-2"]

  const asignaturaOptions =
    asignaturas && asignaturas.length
      ? asignaturas
      : [
          "METODOLOGIA DE LA INVESTIGACION",
          "FORMULACIÓN Y EVALUACIÓN DE PROYECTOS",
          "PROYECTO I",
          "PROYECTO II",
        ]

  const estadoOptions =
    estados && estados.length
      ? estados
      : ["Formulación", "En desarrollo", "Aprobado", "Finalizado", "Archivado"]

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        id: undefined,
        periodo: "",
        asignatura: "",
        docente: "",
        estudiantes: "",
        titulo: "",
        link: "",
        estado: "",
      })
    }
  }, [initialData, open])

  const handleChange = (field: keyof Proyecto, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    const payload: Proyecto = {
      ...formData,
    }
    await onSave(payload)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar proyecto" : "Nuevo proyecto"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          {/* PERIODO */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Periodo</label>
            <Select
              value={formData.periodo}
              onValueChange={(val) => handleChange("periodo", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el periodo" />
              </SelectTrigger>
              <SelectContent>
                {periodoOptions.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ASIGNATURA */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Asignatura</label>
            <Select
              value={formData.asignatura}
              onValueChange={(val) => handleChange("asignatura", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione la asignatura" />
              </SelectTrigger>
              <SelectContent>
                {asignaturaOptions.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DOCENTE */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Docente</label>
            {docentesOptions && docentesOptions.length > 0 ? (
              <Select
                value={formData.docente}
                onValueChange={(val) => handleChange("docente", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el docente" />
                </SelectTrigger>
                <SelectContent>
                  {docentesOptions.map((d) => (
                    <SelectItem key={d.id ?? d.nombreCompleto} value={d.nombreCompleto}>
                      {d.nombreCompleto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                placeholder="Nombre del docente"
                value={formData.docente}
                onChange={(e) => handleChange("docente", e.target.value)}
              />
            )}
          </div>

          {/* ESTADO */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Estado</label>
            <Select
              value={formData.estado}
              onValueChange={(val) => handleChange("estado", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el estado" />
              </SelectTrigger>
              <SelectContent>
                {estadoOptions.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ESTUDIANTES */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium">
              Estudiantes (puedes escribir o seleccionar)
            </label>
            {estudiantesOptions && estudiantesOptions.length > 0 ? (
              <Input
                placeholder="Escribe o pega los nombres de estudiantes separados por coma"
                value={formData.estudiantes}
                onChange={(e) => handleChange("estudiantes", e.target.value)}
                className="text-sm"
              />
            ) : (
              <Input
                placeholder="Nombres de estudiantes (separados por coma)"
                value={formData.estudiantes}
                onChange={(e) => handleChange("estudiantes", e.target.value)}
                className="text-sm"
              />
            )}
          </div>

          {/* TITULO */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium">Título del proyecto</label>
            <Input
              placeholder="Título del proyecto"
              value={formData.titulo}
              onChange={(e) => handleChange("titulo", e.target.value)}
            />
          </div>

          {/* LINK */}
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium">Link del proyecto (Drive, etc.)</label>
            <Input
              placeholder="https://..."
              value={formData.link}
              onChange={(e) => handleChange("link", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
