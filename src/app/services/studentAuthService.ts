// Configuración específica para estudiantes
const STUDENT_API_BASE_URL = "https://microservice-estudiante.onrender.com/api"
const STUDENT_FRONTEND_URL = "https://front-estudiantev1.vercel.app"

export interface StudentLoginCredentials {
  correo_estudiante: string
  contrasenia: string
}

export interface StudentData {
  correo_estudiante: string
  id_estudiante: number
  nombre_estudiante: string
}

export interface StudentAuthResponse {
  data: StudentData
  message: string
  status: number
}

export interface StudentTokens {
  id_estudiante: number
  correo_estudiante: string
  nombre_estudiante: string
  auth_source: string
}

class StudentAuthService {
  async login(credentials: StudentLoginCredentials): Promise<StudentAuthResponse | null> {
    console.log("🎓 StudentAuthService.login - INICIANDO LOGIN ESTUDIANTE")
    console.log("📥 StudentAuthService.login - INPUT credentials:", {
      correo_estudiante: credentials.correo_estudiante ? credentials.correo_estudiante.substring(0, 3) + "***" : "",
      contrasenia: "***",
    })

    try {
      const requestBody = {
        correo_estudiante: credentials.correo_estudiante,
        contrasenia: credentials.contrasenia,
      }
      console.log("📤 StudentAuthService.login - REQUEST BODY REAL:",requestBody)
      console.log("📤 JSON enviado al backend:",JSON.stringify(requestBody, null, 2))
      console.log("📤 StudentAuthService.login - REQUEST BODY:", {
        correo_estudiante:requestBody.correo_estudiante ? requestBody.correo_estudiante.substring(0, 3) + "***" : "",
        contrasenia:"***",
      })

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
      console.log("📦 FINAL Payload enviado al backend:", requestOptions.body)
      console.log("⚙️ StudentAuthService.login - REQUEST OPTIONS:", {
        method: requestOptions.method,
        headers: requestOptions.headers,
      })

      console.log("📡 StudentAuthService.login - Enviando request al backend de estudiantes...")
      const response = await fetch(`${STUDENT_API_BASE_URL}/login`, requestOptions)
      console.log("📨 StudentAuthService.login - RESPONSE STATUS:", response.status)

      const data: StudentAuthResponse = await response.json()
      console.log("📋 StudentAuthService.login - RESPONSE DATA:", data)

      if (data.status === 200 && data.data) {
        console.log("✅ StudentAuthService.login - LOGIN EXITOSO")
        console.log("💾 StudentAuthService.login - Guardando datos del estudiante...")

        // Guardar datos del estudiante en localStorage
        localStorage.setItem("id_estudiante", data.data.id_estudiante.toString())
        console.log("💾 StudentAuthService.login - id_estudiante guardado:", data.data.id_estudiante)

        localStorage.setItem("correo_estudiante", data.data.correo_estudiante)
        console.log("💾 StudentAuthService.login - correo_estudiante guardado:", data.data.correo_estudiante)

        localStorage.setItem("nombre_estudiante", data.data.nombre_estudiante)
        console.log("💾 StudentAuthService.login - nombre_estudiante guardado:", data.data.nombre_estudiante)

        localStorage.setItem("student_auth_source", "front-login")
        console.log("💾 StudentAuthService.login - student_auth_source guardado")

        console.log("💾 StudentAuthService.login - Todos los datos del estudiante guardados")
      } else {
        console.log("❌ StudentAuthService.login - LOGIN FALLIDO")
        console.log("❌ StudentAuthService.login - Razón:", data.message)
      }

      console.log("📤 StudentAuthService.login - RETORNANDO RESPONSE:", data)
      return data
    } catch (error) {
      console.error("💥 StudentAuthService.login - ERROR CAPTURADO:", error)
      return null
    }
  }

  isStudentAuthenticated(): boolean {
    console.log("🔐 StudentAuthService.isStudentAuthenticated - INICIANDO")

    const idEstudiante = localStorage.getItem("id_estudiante")
    const correoEstudiante = localStorage.getItem("correo_estudiante")
    const authSource = localStorage.getItem("student_auth_source")

    console.log("🔍 StudentAuthService.isStudentAuthenticated - Verificando datos:", {
      hasIdEstudiante: !!idEstudiante,
      hasCorreoEstudiante: !!correoEstudiante,
      authSource,
    })

    const result = !!(idEstudiante && correoEstudiante && authSource === "front-login")
    console.log("📤 StudentAuthService.isStudentAuthenticated - RETORNANDO:", result)
    return result
  }

  getStoredStudentData(): StudentData | null {
    console.log("📦 StudentAuthService.getStoredStudentData - INICIANDO")

    try {
      const idEstudiante = localStorage.getItem("id_estudiante")
      const correoEstudiante = localStorage.getItem("correo_estudiante")
      const nombreEstudiante = localStorage.getItem("nombre_estudiante")

      console.log("🔍 StudentAuthService.getStoredStudentData - Datos encontrados:", {
        idEstudiante,
        correoEstudiante,
        nombreEstudiante,
      })

      if (!idEstudiante || !correoEstudiante || !nombreEstudiante) {
        console.log("❌ StudentAuthService.getStoredStudentData - Faltan datos")
        return null
      }

      const result: StudentData = {
        id_estudiante: Number.parseInt(idEstudiante),
        correo_estudiante: correoEstudiante,
        nombre_estudiante: nombreEstudiante,
      }

      console.log("📤 StudentAuthService.getStoredStudentData - RETORNANDO:", result)
      return result
    } catch (error) {
      console.error("💥 StudentAuthService.getStoredStudentData - ERROR:", error)
      return null
    }
  }

  private createStudentAuthenticatedUrl(baseUrl: string, studentData: StudentData): string {
    console.log("🔗 StudentAuthService.createStudentAuthenticatedUrl - INICIANDO")
    console.log("📥 StudentAuthService.createStudentAuthenticatedUrl - INPUT:", {
      baseUrl,
      studentData,
    })

    try {
      const url = new URL(baseUrl)

      // Agregar datos del estudiante como query parameters
      url.searchParams.set("id_estudiante", studentData.id_estudiante.toString())
      url.searchParams.set("correo_estudiante", studentData.correo_estudiante)
      url.searchParams.set("nombre_estudiante", studentData.nombre_estudiante)
      url.searchParams.set("auth_source", "front-login")
      url.searchParams.set("timestamp", Date.now().toString())

      const finalUrl = url.toString()
      console.log("🔗 StudentAuthService.createStudentAuthenticatedUrl - URL CREADA:", finalUrl)
      console.log("📤 StudentAuthService.createStudentAuthenticatedUrl - RETORNANDO URL completa")

      return finalUrl
    } catch (error) {
      console.error("💥 StudentAuthService.createStudentAuthenticatedUrl - ERROR:", error)
      console.log("🔄 StudentAuthService.createStudentAuthenticatedUrl - Retornando URL base como fallback")
      return baseUrl
    }
  }

  redirectToStudentFrontendWithData(): void {
    console.log("🌐 StudentAuthService.redirectToStudentFrontendWithData - INICIANDO")

    const studentData = this.getStoredStudentData()
    console.log("🔍 StudentAuthService.redirectToStudentFrontendWithData - Datos del estudiante:", studentData)

    if (!studentData) {
      console.error("❌ StudentAuthService.redirectToStudentFrontendWithData - No hay datos del estudiante")
      console.log("🔄 StudentAuthService.redirectToStudentFrontendWithData - Redirigiendo sin datos")
      window.location.href = STUDENT_FRONTEND_URL
      return
    }

    try {
      // Crear URL con datos del estudiante
      const authenticatedUrl = this.createStudentAuthenticatedUrl(STUDENT_FRONTEND_URL, studentData)
      console.log("✅ StudentAuthService.redirectToStudentFrontendWithData - URL autenticada creada")

      console.log("🚀 StudentAuthService.redirectToStudentFrontendWithData - REDIRIGIENDO...")
      // Redirigir con datos en la URL
      window.location.href = authenticatedUrl
    } catch (error) {
      console.error("💥 StudentAuthService.redirectToStudentFrontendWithData - ERROR:", error)
      console.log("🔄 StudentAuthService.redirectToStudentFrontendWithData - Redirigiendo sin datos como fallback")
      window.location.href = STUDENT_FRONTEND_URL
    }
  }

  logoutStudent(): void {
    console.log("🚪 StudentAuthService.logoutStudent - INICIANDO LOGOUT ESTUDIANTE")

    console.log("🧹 StudentAuthService.logoutStudent - Limpiando localStorage...")
    // Limpiar datos específicos del estudiante
    localStorage.removeItem("id_estudiante")
    localStorage.removeItem("correo_estudiante")
    localStorage.removeItem("nombre_estudiante")
    localStorage.removeItem("student_auth_source")

    console.log("✅ StudentAuthService.logoutStudent - localStorage de estudiante limpiado")
  }

  // Función estática para procesar datos del estudiante desde URL (para Front-Estudiante)
  static processStudentDataFromUrl(): StudentTokens | null {
    console.log("🔍 StudentAuthService.processStudentDataFromUrl - INICIANDO (STATIC)")

    try {
      const urlParams = new URLSearchParams(window.location.search)
      console.log(
        "🔍 StudentAuthService.processStudentDataFromUrl - URL params encontrados:",
        Object.fromEntries(urlParams.entries()),
      )

      const idEstudiante = urlParams.get("id_estudiante")
      const correoEstudiante = urlParams.get("correo_estudiante")
      const nombreEstudiante = urlParams.get("nombre_estudiante")
      const authSource = urlParams.get("auth_source")

      console.log("🔍 StudentAuthService.processStudentDataFromUrl - Parámetros extraídos:", {
        idEstudiante,
        correoEstudiante,
        nombreEstudiante,
        authSource,
      })

      if (!idEstudiante || !correoEstudiante || !nombreEstudiante || authSource !== "front-login") {
        console.log(
          "❌ StudentAuthService.processStudentDataFromUrl - Faltan parámetros necesarios o fuente incorrecta",
        )
        return null
      }

      const studentTokens: StudentTokens = {
        id_estudiante: Number.parseInt(idEstudiante),
        correo_estudiante: correoEstudiante,
        nombre_estudiante: nombreEstudiante,
        auth_source: authSource,
      }

      console.log("✅ StudentAuthService.processStudentDataFromUrl - Datos procesados exitosamente")
      console.log("📤 StudentAuthService.processStudentDataFromUrl - RETORNANDO datos")
      return studentTokens
    } catch (error) {
      console.error("💥 StudentAuthService.processStudentDataFromUrl - ERROR:", error)
      return null
    }
  }

  // Función estática para limpiar URL después de procesar datos
  static cleanUrlAfterStudentDataProcessing(): void {
    console.log("🧹 StudentAuthService.cleanUrlAfterStudentDataProcessing - INICIANDO (STATIC)")

    try {
      const url = new URL(window.location.href)

      // Remover parámetros de autenticación del estudiante
      url.searchParams.delete("id_estudiante")
      url.searchParams.delete("correo_estudiante")
      url.searchParams.delete("nombre_estudiante")
      url.searchParams.delete("auth_source")
      url.searchParams.delete("timestamp")

      const cleanUrl = url.toString()
      console.log("🧹 StudentAuthService.cleanUrlAfterStudentDataProcessing - URL limpia:", cleanUrl)

      // Actualizar URL sin recargar la página
      window.history.replaceState({}, document.title, cleanUrl)
      console.log("✅ StudentAuthService.cleanUrlAfterStudentDataProcessing - URL actualizada")
    } catch (error) {
      console.error("💥 StudentAuthService.cleanUrlAfterStudentDataProcessing - ERROR:", error)
    }
  }
}

export const studentAuthService = new StudentAuthService()
export { StudentAuthService }
console.log("🏗️ StudentAuthService - Instancia creada:", studentAuthService)
