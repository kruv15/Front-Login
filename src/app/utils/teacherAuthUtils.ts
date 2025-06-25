import {
  teacherAuthService,
  TeacherAuthService,
  type TeacherData,
  type TeacherTokens,
} from "../services/teacherAuthService"

/**
 * Utilidades para manejo de autenticación de docentes entre dominios
 * Este archivo puede ser copiado a Front-Docente
 */

export interface TeacherCrossDomainAuthResult {
  success: boolean
  teacher: TeacherData | null
  teacherTokens: TeacherTokens | null
  error?: string
}

/**
 * Función principal para inicializar autenticación de docente en Front-Docente
 * Debe ser llamada al cargar la aplicación
 */
export function initializeTeacherCrossDomainAuth(): TeacherCrossDomainAuthResult {
  console.log("🔄 TeacherAuthUtils.initializeTeacherCrossDomainAuth - INICIANDO")

  try {
    // 1. Intentar obtener datos del docente de la URL (viene de Front-Login)
    console.log("🔍 TeacherAuthUtils.initializeTeacherCrossDomainAuth - Buscando datos en URL...")
    const teacherDataFromUrl = TeacherAuthService.processTeacherDataFromUrl()

    if (teacherDataFromUrl) {
      console.log("✅ TeacherAuthUtils.initializeTeacherCrossDomainAuth - Datos encontrados en URL")
      console.log("💾 TeacherAuthUtils.initializeTeacherCrossDomainAuth - Guardando datos en localStorage...")

      // Guardar datos en localStorage del dominio actual
      localStorage.setItem("id_docente", teacherDataFromUrl.id.toString())
      localStorage.setItem("usuario_docente", teacherDataFromUrl.usuario)
      localStorage.setItem("nombre_docente", teacherDataFromUrl.nombre)
      localStorage.setItem("apellidos_docente", teacherDataFromUrl.apellidos)
      localStorage.setItem("correo_docente", teacherDataFromUrl.correo)
      localStorage.setItem("teacher_auth_source", teacherDataFromUrl.auth_source)

      console.log("✅ TeacherAuthUtils.initializeTeacherCrossDomainAuth - Datos guardados")
      console.log("🧹 TeacherAuthUtils.initializeTeacherCrossDomainAuth - Limpiando URL...")

      // Limpiar URL
      TeacherAuthService.cleanUrlAfterTeacherDataProcessing()

      const teacherData: TeacherData = {
        id: teacherDataFromUrl.id,
        usuario: teacherDataFromUrl.usuario,
        nombre: teacherDataFromUrl.nombre,
        apellidos: teacherDataFromUrl.apellidos,
        correo: teacherDataFromUrl.correo,
        celular: 0,
        create_at: "",
        nacimiento: "",
        password: "",
        update_at: "",
      }

      return {
        success: true,
        teacher: teacherData,
        teacherTokens: teacherDataFromUrl,
      }
    }

    // 2. Si no hay datos en URL, verificar localStorage local
    console.log(
      "🔍 TeacherAuthUtils.initializeTeacherCrossDomainAuth - No hay datos en URL, verificando localStorage...",
    )
    const localTeacherData = teacherAuthService.getStoredTeacherData()

    if (localTeacherData && teacherAuthService.isTeacherAuthenticated()) {
      console.log("✅ TeacherAuthUtils.initializeTeacherCrossDomainAuth - Datos encontrados en localStorage")

      const teacherTokens: TeacherTokens = {
        id: localTeacherData.id,
        usuario: localTeacherData.usuario,
        nombre: localTeacherData.nombre,
        apellidos: localTeacherData.apellidos,
        correo: localTeacherData.correo,
        auth_source: "front-login",
      }

      return {
        success: true,
        teacher: localTeacherData,
        teacherTokens: teacherTokens,
      }
    }

    // 3. No hay autenticación
    console.log("❌ TeacherAuthUtils.initializeTeacherCrossDomainAuth - No se encontró autenticación")
    return {
      success: false,
      teacher: null,
      teacherTokens: null,
      error: "No teacher authentication found",
    }
  } catch (error) {
    console.error("💥 TeacherAuthUtils.initializeTeacherCrossDomainAuth - ERROR:", error)
    return {
      success: false,
      teacher: null,
      teacherTokens: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Verificar si el docente está autenticado
 */
export function isTeacherAuthenticated(): boolean {
  console.log("🔐 TeacherAuthUtils.isTeacherAuthenticated - INICIANDO")

  const result = teacherAuthService.isTeacherAuthenticated()
  console.log("📤 TeacherAuthUtils.isTeacherAuthenticated - RETORNANDO:", result)
  return result
}

/**
 * Obtener datos del docente actual
 */
export function getCurrentTeacherData(): TeacherData | null {
  console.log("👤 TeacherAuthUtils.getCurrentTeacherData - INICIANDO")

  const result = teacherAuthService.getStoredTeacherData()
  console.log("📤 TeacherAuthUtils.getCurrentTeacherData - RETORNANDO:", result)
  return result
}

/**
 * Redirigir de vuelta a Front-Login si no está autenticado
 */
export function redirectToLogin(): void {
  console.log("🔄 TeacherAuthUtils.redirectToLogin - REDIRIGIENDO A FRONT-LOGIN")
  window.location.href = "https://front-loginv1.vercel.app"
}

/**
 * Cerrar sesión de docente y redirigir a Front-Login
 */
export function logoutTeacherAndRedirect(): void {
  console.log("🚪 TeacherAuthUtils.logoutTeacherAndRedirect - INICIANDO")

  // Limpiar localStorage
  teacherAuthService.logoutTeacher()

  console.log("🧹 TeacherAuthUtils.logoutTeacherAndRedirect - localStorage limpiado")

  // Redirigir a Front-Login con parámetro de logout
  window.location.href = "https://front-loginv1.vercel.app?logged_out=true"
}
