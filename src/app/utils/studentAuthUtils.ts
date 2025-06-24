import { studentAuthService, StudentAuthService, type StudentData, type StudentTokens } from "../services/studentAuthService"

/**
 * Utilidades para manejo de autenticación de estudiantes entre dominios
 * Este archivo puede ser copiado a Front-Estudiante
 */

export interface StudentCrossDomainAuthResult {
  success: boolean
  student: StudentData | null
  studentTokens: StudentTokens | null
  error?: string
}

/**
 * Función principal para inicializar autenticación de estudiante en Front-Estudiante
 * Debe ser llamada al cargar la aplicación
 */
export function initializeStudentCrossDomainAuth(): StudentCrossDomainAuthResult {
  console.log("🔄 StudentAuthUtils.initializeStudentCrossDomainAuth - INICIANDO")

  try {
    // 1. Intentar obtener datos del estudiante de la URL (viene de Front-Login)
    console.log("🔍 StudentAuthUtils.initializeStudentCrossDomainAuth - Buscando datos en URL...")
    const studentDataFromUrl = StudentAuthService.processStudentDataFromUrl()

    if (studentDataFromUrl) {
      console.log("✅ StudentAuthUtils.initializeStudentCrossDomainAuth - Datos encontrados en URL")
      console.log("💾 StudentAuthUtils.initializeStudentCrossDomainAuth - Guardando datos en localStorage...")

      // Guardar datos en localStorage del dominio actual
      localStorage.setItem("id_estudiante", studentDataFromUrl.id_estudiante.toString())
      localStorage.setItem("correo_estudiante", studentDataFromUrl.correo_estudiante)
      localStorage.setItem("nombre_estudiante", studentDataFromUrl.nombre_estudiante)
      localStorage.setItem("student_auth_source", studentDataFromUrl.auth_source)

      console.log("✅ StudentAuthUtils.initializeStudentCrossDomainAuth - Datos guardados")
      console.log("🧹 StudentAuthUtils.initializeStudentCrossDomainAuth - Limpiando URL...")

      // Limpiar URL
      StudentAuthService.cleanUrlAfterStudentDataProcessing()
      const studentData: StudentData = {
        id_estudiante: studentDataFromUrl.id_estudiante,
        correo_estudiante: studentDataFromUrl.correo_estudiante,
        nombre_estudiante: studentDataFromUrl.nombre_estudiante,
      }

      return {
        success: true,
        student: studentData,
        studentTokens: studentDataFromUrl,
      }
    }

    // 2. Si no hay datos en URL, verificar localStorage local
    console.log(
      "🔍 StudentAuthUtils.initializeStudentCrossDomainAuth - No hay datos en URL, verificando localStorage...",
    )
    const localStudentData = studentAuthService.getStoredStudentData()

    if (localStudentData && studentAuthService.isStudentAuthenticated()) {
      console.log("✅ StudentAuthUtils.initializeStudentCrossDomainAuth - Datos encontrados en localStorage")

      const studentTokens: StudentTokens = {
        id_estudiante: localStudentData.id_estudiante,
        correo_estudiante: localStudentData.correo_estudiante,
        nombre_estudiante: localStudentData.nombre_estudiante,
        auth_source: "front-login",
      }

      return {
        success: true,
        student: localStudentData,
        studentTokens: studentTokens,
      }
    }

    // 3. No hay autenticación
    console.log("❌ StudentAuthUtils.initializeStudentCrossDomainAuth - No se encontró autenticación")
    return {
      success: false,
      student: null,
      studentTokens: null,
      error: "No student authentication found",
    }
  } catch (error) {
    console.error("💥 StudentAuthUtils.initializeStudentCrossDomainAuth - ERROR:", error)
    return {
      success: false,
      student: null,
      studentTokens: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Verificar si el estudiante está autenticado
 */
export function isStudentAuthenticated(): boolean {
  console.log("🔐 StudentAuthUtils.isStudentAuthenticated - INICIANDO")

  const result = studentAuthService.isStudentAuthenticated()
  console.log("📤 StudentAuthUtils.isStudentAuthenticated - RETORNANDO:", result)
  return result
}

/**
 * Obtener datos del estudiante actual
 */
export function getCurrentStudentData(): StudentData | null {
  console.log("👤 StudentAuthUtils.getCurrentStudentData - INICIANDO")

  const result = studentAuthService.getStoredStudentData()
  console.log("📤 StudentAuthUtils.getCurrentStudentData - RETORNANDO:", result)
  return result
}

/**
 * Redirigir de vuelta a Front-Login si no está autenticado
 */
export function redirectToLogin(): void {
  console.log("🔄 StudentAuthUtils.redirectToLogin - REDIRIGIENDO A FRONT-LOGIN")
  window.location.href = "https://front-loginv1.vercel.app"
}

/**
 * Cerrar sesión de estudiante y redirigir a Front-Login
 */
export function logoutStudentAndRedirect(): void {
  console.log("🚪 StudentAuthUtils.logoutStudentAndRedirect - INICIANDO")

  // Limpiar localStorage
  studentAuthService.logoutStudent()

  console.log("🧹 StudentAuthUtils.logoutStudentAndRedirect - localStorage limpiado")

  // Redirigir a Front-Login con parámetro de logout
  window.location.href = "https://front-loginv1.vercel.app?logged_out=true"
}
