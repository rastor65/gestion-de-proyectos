import { getProyectos } from "@/lib/google-sheets"

export async function GET() {
  try {
    const proyectos = await getProyectos()

    const csv = [
      ["Período", "Asignatura", "Docente", "Estudiantes", "Título", "Estado", "Link"],
      ...proyectos.map((p) => [
        p.periodo,
        p.asignatura,
        p.docente,
        p.estudiantes.join(", "),
        p.titulo,
        p.estado || "Sin estado",
        p.link || "",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="proyectos.csv"',
      },
    })
  } catch (error) {
    console.error("Error exporting projects:", error)
    return Response.json({ error: "Failed to export" }, { status: 500 })
  }
}
