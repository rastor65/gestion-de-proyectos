import { google } from "googleapis"

const sheets = google.sheets("v4")

const getAuthClient = () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: "investigacion-479315",
      private_key_id: "key-id",
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      client_id: "client-id",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })

  return auth
}

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

// ESTUDIANTES operations
export async function getEstudiantes() {
  try {
    const auth = getAuthClient()
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "ESTUDIANTES!A2:C",
    })

    const rows = response.data.values || []
    return rows.map((row: string[]) => ({
      codigo: row[0] || "",
      nombreCompleto: row[1] || "",
      correo: row[2] || "",
    }))
  } catch (error) {
    console.error("Error fetching estudiantes from Google Sheets:", error)
    return []
  }
}

export async function addEstudiante(codigo: string, nombreCompleto: string, correo: string) {
  try {
    const auth = getAuthClient()

    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "ESTUDIANTES!A:C",
      valueInputOption: "RAW",
      requestBody: {
        values: [[codigo, nombreCompleto, correo]],
      },
    })

    return { codigo, nombreCompleto, correo }
  } catch (error) {
    console.error("Error adding estudiante to Google Sheets:", error)
    throw error
  }
}

export async function updateEstudiante(codigo: string, nombreCompleto: string, correo: string) {
  try {
    const auth = getAuthClient()
    const estudiantes = await getEstudiantes()

    const rowIndex = estudiantes.findIndex((e) => e.codigo === codigo) + 2 // +2 for header

    await sheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: `ESTUDIANTES!A${rowIndex}:C${rowIndex}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[codigo, nombreCompleto, correo]],
      },
    })

    return { codigo, nombreCompleto, correo }
  } catch (error) {
    console.error("Error updating estudiante:", error)
    throw error
  }
}

export async function deleteEstudiante(codigo: string) {
  try {
    const auth = getAuthClient()
    const estudiantes = await getEstudiantes()
    const rowIndex = estudiantes.findIndex((e) => e.codigo === codigo) + 2

    await sheets.spreadsheets.values.clear({
      auth,
      spreadsheetId,
      range: `ESTUDIANTES!A${rowIndex}:C${rowIndex}`,
    })

    return true
  } catch (error) {
    console.error("Error deleting estudiante:", error)
    throw error
  }
}

// DOCENTES operations
export async function getDocentes() {
  try {
    const auth = getAuthClient()
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "DOCENTES!A2:G",
    })

    const rows = response.data.values || []
    return rows.map((row: string[]) => ({
      asignatura: row[0] || "",
      apellidos: row[1] || "",
      nombres: row[2] || "",
      nombreCompleto: row[3] || "",
      correo: row[4] || "",
      telefono: row[5] || "",
      tipoVinculacion: row[6] || "",
    }))
  } catch (error) {
    console.error("Error fetching docentes from Google Sheets:", error)
    return []
  }
}

export async function addDocente(
  asignatura: string,
  apellidos: string,
  nombres: string,
  nombreCompleto: string,
  correo: string,
  telefono: string,
  tipoVinculacion: string,
) {
  try {
    const auth = getAuthClient()

    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "DOCENTES!A:G",
      valueInputOption: "RAW",
      requestBody: {
        values: [[asignatura, apellidos, nombres, nombreCompleto, correo, telefono, tipoVinculacion]],
      },
    })

    return { asignatura, apellidos, nombres, nombreCompleto, correo, telefono, tipoVinculacion }
  } catch (error) {
    console.error("Error adding docente to Google Sheets:", error)
    throw error
  }
}

export async function updateDocente(
  nombreCompleto: string,
  asignatura: string,
  apellidos: string,
  nombres: string,
  correo: string,
  telefono: string,
  tipoVinculacion: string,
) {
  try {
    const auth = getAuthClient()
    const docentes = await getDocentes()
    const rowIndex = docentes.findIndex((d) => d.nombreCompleto === nombreCompleto) + 2

    await sheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: `DOCENTES!A${rowIndex}:G${rowIndex}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[asignatura, apellidos, nombres, nombreCompleto, correo, telefono, tipoVinculacion]],
      },
    })

    return { asignatura, apellidos, nombres, nombreCompleto, correo, telefono, tipoVinculacion }
  } catch (error) {
    console.error("Error updating docente:", error)
    throw error
  }
}

export async function deleteDocente(nombreCompleto: string) {
  try {
    const auth = getAuthClient()
    const docentes = await getDocentes()
    const rowIndex = docentes.findIndex((d) => d.nombreCompleto === nombreCompleto) + 2

    await sheets.spreadsheets.values.clear({
      auth,
      spreadsheetId,
      range: `DOCENTES!A${rowIndex}:G${rowIndex}`,
    })

    return true
  } catch (error) {
    console.error("Error deleting docente:", error)
    throw error
  }
}

// PROYECTOS operations
export async function getProyectos() {
  try {
    const auth = getAuthClient()
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "PROYECTOS!A2:H",
    })

    const rows = response.data.values || []
    return rows.map((row: string[]) => ({
      periodo: row[0] || "",
      asignatura: row[1] || "",
      docente: row[2] || "",
      estudiantes: (row[3] || "")
        .split(",")
        .map((e: string) => e.trim())
        .filter((e: string) => e),
      titulo: row[4] || "",
      link: row[5] || "",
      estado: row[6] || "",
    }))
  } catch (error) {
    console.error("Error fetching proyectos from Google Sheets:", error)
    return []
  }
}

export async function addProyecto(
  periodo: string,
  asignatura: string,
  docente: string,
  estudiantes: string[],
  titulo: string,
  link: string,
  estado: string,
) {
  try {
    const auth = getAuthClient()

    await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "PROYECTOS!A:H",
      valueInputOption: "RAW",
      requestBody: {
        values: [[periodo, asignatura, docente, estudiantes.join(", "), titulo, link, estado]],
      },
    })

    return { periodo, asignatura, docente, estudiantes, titulo, link, estado }
  } catch (error) {
    console.error("Error adding proyecto to Google Sheets:", error)
    throw error
  }
}

export async function updateProyecto(
  titulo: string,
  periodo: string,
  asignatura: string,
  docente: string,
  estudiantes: string[],
  link: string,
  estado: string,
) {
  try {
    const auth = getAuthClient()
    const proyectos = await getProyectos()
    const rowIndex = proyectos.findIndex((p) => p.titulo === titulo) + 2

    await sheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: `PROYECTOS!A${rowIndex}:H${rowIndex}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[periodo, asignatura, docente, estudiantes.join(", "), titulo, link, estado]],
      },
    })

    return { periodo, asignatura, docente, estudiantes, titulo, link, estado }
  } catch (error) {
    console.error("Error updating proyecto:", error)
    throw error
  }
}

export async function deleteProyecto(titulo: string) {
  try {
    const auth = getAuthClient()
    const proyectos = await getProyectos()
    const rowIndex = proyectos.findIndex((p) => p.titulo === titulo) + 2

    await sheets.spreadsheets.values.clear({
      auth,
      spreadsheetId,
      range: `PROYECTOS!A${rowIndex}:H${rowIndex}`,
    })

    return true
  } catch (error) {
    console.error("Error deleting proyecto:", error)
    throw error
  }
}
