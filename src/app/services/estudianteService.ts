const API = 'https://microservice-estudiante.onrender.com/api'

export interface EstudiantePayload {
  nombre_estudiante: string
  apellido_estudiante: string
  correo_estudiante: string
  contrasenia: string
  fecha_nacimiento: string
  numero_celular: string
  id_pais: string
  id_ciudad: string
}

export interface Pais {
  id_pais: string
  nombre_pais: string
}

export interface Ciudad {
  id_ciudad: string
  nombre_ciudad: string
}

export interface EstudianteResponse {
  message: string
  success?: boolean
}

export const getPaises = async (): Promise<Pais[]> => {
  const res = await fetch(`${API}/paises`)
  const data = await res.json()
  return data.data
}

export const getCiudades = async (idPais: string): Promise<Ciudad[]> => {
  const res = await fetch(`${API}/ciudades/${idPais}`)
  const data = await res.json()
  return data.data
}

export const registrarEstudiante = async (
  estudianteData: EstudiantePayload
): Promise<EstudianteResponse> => {
  const res = await fetch(`${API}/estudiantes/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(estudianteData),
  })

  const data: EstudianteResponse = await res.json()
  return data
}
