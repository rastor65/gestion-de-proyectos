import { type NextRequest, NextResponse } from "next/server"
import { getProyectos, addProyecto, updateProyecto, deleteProyecto } from "@/lib/google-sheets"

// 🔹 Igualmente dinámica esta ruta
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const proyectos = await getProyectos()
    return NextResponse.json(proyectos)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Error fetching projects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { periodo, asignatura, docente, estudiantes, titulo, link, estado } = body

    const newProyecto = await addProyecto(periodo, asignatura, docente, estudiantes, titulo, link, estado)
    return NextResponse.json(newProyecto, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Error creating project" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { titulo, periodo, asignatura, docente, estudiantes, link, estado } = body

    const updatedProyecto = await updateProyecto(titulo, periodo, asignatura, docente, estudiantes, link, estado)
    return NextResponse.json(updatedProyecto)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Error updating project" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { titulo } = body

    await deleteProyecto(titulo)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Error deleting project" }, { status: 500 })
  }
}
