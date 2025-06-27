// Configuración de URLs para desarrollo y producción
export interface URLConfig {
  frontAdmin: string
  frontDocente: string
  frontEstudiante: string
  backAdmin: string
  backEstudiante: string
  backDocente: string
  frontLogin: string
}

export const PRODUCTION_URLS: URLConfig = {
  frontAdmin: "https://front-adminv1.vercel.app",
  frontDocente: "https://front-teacher.vercel.app/",
  frontEstudiante: "https://front-estudiantev1.vercel.app",
  backAdmin: "https://microservice-admin.onrender.com/api",
  backEstudiante: "https://microservice-estudiante.onrender.com/api",
  backDocente: "https://microservice-docente.onrender.com/apidocentes/v1/docente",
  frontLogin: "https://front-loginv1.vercel.app",
}

export const LOCALHOST_URLS: URLConfig = {
  frontAdmin: "http://localhost:3002",
  frontDocente: "http://localhost:3001",
  frontEstudiante: "http://localhost:3004",
  backAdmin: "http://localhost:4001/api",
  backEstudiante: "http://localhost:4002/api",
  backDocente: "http://localhost:4003/apidocentes/v1/docente",
  frontLogin: "http://localhost:3003",
}

export function getURLConfig(useLocalhost: boolean): URLConfig {
  console.log("🔧 URLConfig - Modo seleccionado:", useLocalhost ? "LOCALHOST" : "PRODUCTION")
  const config = useLocalhost ? LOCALHOST_URLS : PRODUCTION_URLS
  console.log("🔧 URLConfig - Configuración:", config)
  return config
}
