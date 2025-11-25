// components/modals/docente-modal.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

export interface Docente {
  id?: string          // <- aquí dejamos id como string (fila, uuid, lo que quieras)
  asignatura: string
  apellidos: string
  nombres: string
  nombreCompleto: string
  correo: string
  telefono: string
  tipoVinculacion: string
}

export interface DocenteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (docente: Docente) => Promise<void> | void
  initialData: Docente | null
}

export default function DocenteModal({
  open,
  onOpenChange,
  onSave,
  initialData,
}: DocenteModalProps) {
  const [formData, setFormData] = useState<Docente>({
    id: undefined,
    asignatura: "",
    apellidos: "",
    nombres: "",
    nombreCompleto: "",
    correo: "",
    telefono: "",
    tipoVinculacion: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        id: undefined,
        asignatura: "",
        apellidos: "",
        nombres: "",
        nombreCompleto: "",
        correo: "",
        telefono: "",
        tipoVinculacion: "",
      })
    }
  }, [initialData, open])

  const handleChange = (field: keyof Docente, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    const payload: Docente = {
      ...formData,
      nombreCompleto:
        formData.nombreCompleto ||
        `${formData.nombres || ""} ${formData.apellidos || ""}`.trim(),
    }
    await onSave(payload)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar docente" : "Nuevo docente"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Select
            value={formData.asignatura}
            onValueChange={(val) => handleChange("asignatura", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Asignatura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="METODOLOGIA DE LA INVESTIGACION">
                METODOLOGIA DE LA INVESTIGACION
              </SelectItem>
              <SelectItem value="FORMULACIÓN Y EVALUACIÓN DE PROYECTOS">
                FORMULACIÓN Y EVALUACIÓN DE PROYECTOS
              </SelectItem>
              <SelectItem value="PROYECTO I">PROYECTO I</SelectItem>
              <SelectItem value="PROYECTO II">PROYECTO II</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Apellidos"
            value={formData.apellidos}
            onChange={(e) => handleChange("apellidos", e.target.value)}
          />
          <Input
            placeholder="Nombres"
            value={formData.nombres}
            onChange={(e) => handleChange("nombres", e.target.value)}
          />
          <Input
            placeholder="Nombre completo (opcional)"
            value={formData.nombreCompleto}
            onChange={(e) => handleChange("nombreCompleto", e.target.value)}
          />
          <Input
            placeholder="Correo"
            type="email"
            value={formData.correo}
            onChange={(e) => handleChange("correo", e.target.value)}
          />
          <Input
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
          />

          <Select
            value={formData.tipoVinculacion}
            onValueChange={(val) => handleChange("tipoVinculacion", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de vinculación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Catedrático">Catedrático</SelectItem>
              <SelectItem value="Ocasional">Ocasional</SelectItem>
              <SelectItem value="Planta">Planta</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
