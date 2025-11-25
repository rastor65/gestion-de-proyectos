import { type NextRequest, NextResponse } from "next/server"
import { getEstudiantes, addEstudiante, updateEstudiante, deleteEstudiante } from "@/lib/google-sheets"

// 🔹 Forzamos la ruta a ser dinámica
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const estudiantes = await getEstudiantes()
    return NextResponse.json(estudiantes)
  } catch (error) {
    console.error("Error fetching students:", error)
    return NextResponse.json({ error: "Error fetching students" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { codigo, nombreCompleto, correo } = body

    const newEstudiante = await addEstudiante(codigo, nombreCompleto, correo)
    return NextResponse.json(newEstudiante, { status: 201 })
  } catch (error) {
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Error creating student" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { codigo, nombreCompleto, correo } = body

    const updatedEstudiante = await updateEstudiante(codigo, nombreCompleto, correo)
    return NextResponse.json(updatedEstudiante)
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json({ error: "Error updating student" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { codigo } = body

    await deleteEstudiante(codigo)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting student:", error)
    return NextResponse.json({ error: "Error deleting student" }, { status: 500 })
  }
}
