import { type NextRequest, NextResponse } from "next/server"
import { getDocentes, addDocente, updateDocente, deleteDocente } from "@/lib/google-sheets"

export async function GET() {
  try {
    const docentes = await getDocentes()
    return NextResponse.json(docentes)
  } catch (error) {
    console.error("Error fetching teachers:", error)
    return NextResponse.json({ error: "Error fetching teachers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { asignatura, apellidos, nombres, nombreCompleto, correo, telefono, tipoVinculacion } = body

    const newDocente = await addDocente(
      asignatura,
      apellidos,
      nombres,
      nombreCompleto,
      correo,
      telefono,
      tipoVinculacion,
    )
    return NextResponse.json(newDocente, { status: 201 })
  } catch (error) {
    console.error("Error creating teacher:", error)
    return NextResponse.json({ error: "Error creating teacher" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombreCompleto, asignatura, apellidos, nombres, correo, telefono, tipoVinculacion } = body

    const updatedDocente = await updateDocente(
      nombreCompleto,
      asignatura,
      apellidos,
      nombres,
      correo,
      telefono,
      tipoVinculacion,
    )
    return NextResponse.json(updatedDocente)
  } catch (error) {
    console.error("Error updating teacher:", error)
    return NextResponse.json({ error: "Error updating teacher" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { nombreCompleto } = body

    await deleteDocente(nombreCompleto)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting teacher:", error)
    return NextResponse.json({ error: "Error deleting teacher" }, { status: 500 })
  }
}
