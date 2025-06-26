const API = 'https://microservice-estudiante.onrender.com/api'

export const getPaises = async () => {
  const res = await fetch(`${API}/paises`)
  const data = await res.json()
  return data.data // contiene lista de países
}

export const getCiudades = async (idPais: number) => {
  const res = await fetch(`${API}/ciudades/${idPais}`)
  const data = await res.json()
  return data.data // contiene lista de ciudades
}

export const registrarEstudiante = async (estudianteData: any) => {
  const res = await fetch(`${API}/estudiantes/registrar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(estudianteData)
  })

  const data = await res.json()
  return data
}
