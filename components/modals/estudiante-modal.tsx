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

export interface Estudiante {
  id?: string
  codigo: string
  nombreCompleto: string
  correo: string
}

export interface EstudianteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (estudiante: Estudiante) => Promise<void> | void
  initialData: Estudiante | null
}

export default function EstudianteModal({
  open,
  onOpenChange,
  onSave,
  initialData,
}: EstudianteModalProps) {
  const [formData, setFormData] = useState<Estudiante>({
    id: undefined,
    codigo: "",
    nombreCompleto: "",
    correo: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        id: undefined,
        codigo: "",
        nombreCompleto: "",
        correo: "",
      })
    }
  }, [initialData, open])

  const handleChange = (field: keyof Estudiante, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    await onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar estudiante" : "Nuevo estudiante"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <Input
            placeholder="Código estudiantil"
            value={formData.codigo}
            onChange={(e) => handleChange("codigo", e.target.value)}
          />
          <Input
            placeholder="Nombre completo"
            value={formData.nombreCompleto}
            onChange={(e) => handleChange("nombreCompleto", e.target.value)}
          />
          <Input
            placeholder="Correo institucional"
            type="email"
            value={formData.correo}
            onChange={(e) => handleChange("correo", e.target.value)}
          />
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
