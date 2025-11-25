// components/modals/docente-modal.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// …otros imports

interface DocenteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  // …otras props
}

export default function DocenteModal({ open, onOpenChange }: DocenteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Docente</DialogTitle>
        </DialogHeader>
        {/* formulario aquí */}
      </DialogContent>
    </Dialog>
  )
}
