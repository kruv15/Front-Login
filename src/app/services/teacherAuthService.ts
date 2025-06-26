// Configuración específica para docentes
const TEACHER_API_BASE_URL = "https://microservice-docente.onrender.com/apidocentes/v1/docente"
const TEACHER_FRONTEND_URL = "https://front-docente.onrender.com"

export interface TeacherLoginCredentials {
  user: string
  password: string
}

export interface TeacherData {
  apellidos: string
  celular: number
  correo: string
  create_at: string
  id: number
  nacimiento: string
  nombre: string
  password: string
  update_at: string
  usuario: string
}

export interface TeacherAuthResponse {
  data: TeacherData[] | null
  message: string
  status: number
}

export interface TeacherTokens {
  id: number
  usuario: string
  nombre: string
  apellidos: string
  correo: string
  auth_source: string
}

class TeacherAuthService {
  async login(credentials: TeacherLoginCredentials): Promise<TeacherAuthResponse | null> {
    console.log("👨‍🏫 TeacherAuthService.login - INICIANDO LOGIN DOCENTE")
    console.log("📥 TeacherAuthService.login - INPUT credentials:", {
      user: credentials.user ? credentials.user.substring(0, 3) + "***" : "",
      password: "***",
    })

    try {
      const requestBody = {
        user: credentials.user,
        password: credentials.password,
      }
      console.log("📤 TeacherAuthService.login - REQUEST BODY REAL:", requestBody)
      console.log("📤 JSON enviado al backend:", JSON.stringify(requestBody, null, 2))
      console.log("📤 TeacherAuthService.login - REQUEST BODY:", {
        user: requestBody.user ? requestBody.user.substring(0, 3) + "***" : "",
        password: "***",
      })

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
      console.log("📦 FINAL Payload enviado al backend:", requestOptions.body)
      console.log("⚙️ TeacherAuthService.login - REQUEST OPTIONS:", {
        method: requestOptions.method,
        headers: requestOptions.headers,
        body: requestOptions.body,
      })

      console.log("📡 TeacherAuthService.login - Enviando request al backend de docentes...")
      console.log(`Link: ${TEACHER_API_BASE_URL}/login`)
      const response = await fetch(`${TEACHER_API_BASE_URL}/login`, requestOptions)
      console.log("📨 TeacherAuthService.login - RESPONSE:", response)
      console.log("📨 TeacherAuthService.login - RESPONSE STATUS:", response.status)

      let data: TeacherAuthResponse

      try {
        data = await response.json()
        console.log("📋 TeacherAuthService.login - RESPONSE DATA:", data)
      } catch (error) {
        console.error("💥 TeacherAuthService.login - Error al parsear JSON:", error)
        return {
          status: response.status,
          message: "Respuesta inválida del servidor (no es JSON)",
          data: null,
        }
      }

      if (data.status === 200 && data.data && data.data.length > 0) {
        console.log("✅ TeacherAuthService.login - LOGIN EXITOSO")
        console.log("💾 TeacherAuthService.login - Guardando datos del docente...")

        const teacherData = data.data[0] // Tomar el primer elemento del array

        // Guardar datos del docente en localStorage
        localStorage.setItem("id_docente", teacherData.id.toString())
        console.log("💾 TeacherAuthService.login - id_docente guardado:", teacherData.id)

        localStorage.setItem("usuario_docente", teacherData.usuario)
        console.log("💾 TeacherAuthService.login - usuario_docente guardado:", teacherData.usuario)

        localStorage.setItem("nombre_docente", teacherData.nombre)
        console.log("💾 TeacherAuthService.login - nombre_docente guardado:", teacherData.nombre)

        localStorage.setItem("apellidos_docente", teacherData.apellidos)
        console.log("💾 TeacherAuthService.login - apellidos_docente guardado:", teacherData.apellidos)

        localStorage.setItem("correo_docente", teacherData.correo)
        console.log("💾 TeacherAuthService.login - correo_docente guardado:", teacherData.correo)

        localStorage.setItem("teacher_auth_source", "front-login")
        console.log("💾 TeacherAuthService.login - teacher_auth_source guardado")

        console.log("💾 TeacherAuthService.login - Todos los datos del docente guardados")
      } else {
        console.log("❌ TeacherAuthService.login - LOGIN FALLIDO")
        console.log("❌ TeacherAuthService.login - Razón:", data.message)
      }

      console.log("📤 TeacherAuthService.login - RETORNANDO RESPONSE:", data)
      return data
    } catch (error) {
      console.error("💥 TeacherAuthService.login - ERROR CAPTURADO:", error)
      return null
    }
  }

  isTeacherAuthenticated(): boolean {
    console.log("🔐 TeacherAuthService.isTeacherAuthenticated - INICIANDO")

    const idDocente = localStorage.getItem("id_docente")
    const usuarioDocente = localStorage.getItem("usuario_docente")
    const authSource = localStorage.getItem("teacher_auth_source")

    console.log("🔍 TeacherAuthService.isTeacherAuthenticated - Verificando datos:", {
      hasIdDocente: !!idDocente,
      hasUsuarioDocente: !!usuarioDocente,
      authSource,
    })

    const result = !!(idDocente && usuarioDocente && authSource === "front-login")
    console.log("📤 TeacherAuthService.isTeacherAuthenticated - RETORNANDO:", result)
    return result
  }

  getStoredTeacherData(): TeacherData | null {
    console.log("📦 TeacherAuthService.getStoredTeacherData - INICIANDO")

    try {
      const idDocente = localStorage.getItem("id_docente")
      const usuarioDocente = localStorage.getItem("usuario_docente")
      const nombreDocente = localStorage.getItem("nombre_docente")
      const apellidosDocente = localStorage.getItem("apellidos_docente")
      const correoDocente = localStorage.getItem("correo_docente")

      console.log("🔍 TeacherAuthService.getStoredTeacherData - Datos encontrados:", {
        idDocente,
        usuarioDocente,
        nombreDocente,
        apellidosDocente,
        correoDocente,
      })

      if (!idDocente || !usuarioDocente || !nombreDocente || !apellidosDocente || !correoDocente) {
        console.log("❌ TeacherAuthService.getStoredTeacherData - Faltan datos")
        return null
      }

      const result: TeacherData = {
        id: Number.parseInt(idDocente),
        usuario: usuarioDocente,
        nombre: nombreDocente,
        apellidos: apellidosDocente,
        correo: correoDocente,
        celular: 0, // No se guarda en localStorage
        create_at: "",
        nacimiento: "",
        password: "",
        update_at: "",
      }

      console.log("📤 TeacherAuthService.getStoredTeacherData - RETORNANDO:", result)
      return result
    } catch (error) {
      console.error("💥 TeacherAuthService.getStoredTeacherData - ERROR:", error)
      return null
    }
  }

  private createTeacherAuthenticatedUrl(baseUrl: string, teacherData: TeacherData): string {
    console.log("🔗 TeacherAuthService.createTeacherAuthenticatedUrl - INICIANDO")
    console.log("📥 TeacherAuthService.createTeacherAuthenticatedUrl - INPUT:", {
      baseUrl,
      teacherData,
    })

    try {
      const url = new URL(baseUrl)

      // Agregar datos del docente como query parameters
      url.searchParams.set("id_docente", teacherData.id.toString())
      url.searchParams.set("usuario_docente", teacherData.usuario)
      url.searchParams.set("nombre_docente", teacherData.nombre)
      url.searchParams.set("apellidos_docente", teacherData.apellidos)
      url.searchParams.set("correo_docente", teacherData.correo)
      url.searchParams.set("auth_source", "front-login")
      url.searchParams.set("timestamp", Date.now().toString())

      const finalUrl = url.toString()
      console.log("🔗 TeacherAuthService.createTeacherAuthenticatedUrl - URL CREADA:", finalUrl)
      console.log("📤 TeacherAuthService.createTeacherAuthenticatedUrl - RETORNANDO URL completa")

      return finalUrl
    } catch (error) {
      console.error("💥 TeacherAuthService.createTeacherAuthenticatedUrl - ERROR:", error)
      console.log("🔄 TeacherAuthService.createTeacherAuthenticatedUrl - Retornando URL base como fallback")
      return baseUrl
    }
  }

  redirectToTeacherFrontendWithData(): void {
    console.log("🌐 TeacherAuthService.redirectToTeacherFrontendWithData - INICIANDO")

    const teacherData = this.getStoredTeacherData()
    console.log("🔍 TeacherAuthService.redirectToTeacherFrontendWithData - Datos del docente:", teacherData)

    if (!teacherData) {
      console.error("❌ TeacherAuthService.redirectToTeacherFrontendWithData - No hay datos del docente")
      console.log("🔄 TeacherAuthService.redirectToTeacherFrontendWithData - Redirigiendo sin datos")
      window.location.href = TEACHER_FRONTEND_URL
      return
    }

    try {
      // Crear URL con datos del docente
      const authenticatedUrl = this.createTeacherAuthenticatedUrl(TEACHER_FRONTEND_URL, teacherData)
      console.log("✅ TeacherAuthService.redirectToTeacherFrontendWithData - URL autenticada creada")

      console.log("🚀 TeacherAuthService.redirectToTeacherFrontendWithData - REDIRIGIENDO...")
      // Redirigir con datos en la URL
      window.location.href = authenticatedUrl
    } catch (error) {
      console.error("💥 TeacherAuthService.redirectToTeacherFrontendWithData - ERROR:", error)
      console.log("🔄 TeacherAuthService.redirectToTeacherFrontendWithData - Redirigiendo sin datos como fallback")
      window.location.href = TEACHER_FRONTEND_URL
    }
  }

  logoutTeacher(): void {
    console.log("🚪 TeacherAuthService.logoutTeacher - INICIANDO LOGOUT DOCENTE")

    console.log("🧹 TeacherAuthService.logoutTeacher - Limpiando localStorage...")
    // Limpiar datos específicos del docente
    localStorage.removeItem("id_docente")
    localStorage.removeItem("usuario_docente")
    localStorage.removeItem("nombre_docente")
    localStorage.removeItem("apellidos_docente")
    localStorage.removeItem("correo_docente")
    localStorage.removeItem("teacher_auth_source")

    console.log("✅ TeacherAuthService.logoutTeacher - localStorage de docente limpiado")
  }

  // Función estática para procesar datos del docente desde URL (para Front-Docente)
  static processTeacherDataFromUrl(): TeacherTokens | null {
    console.log("🔍 TeacherAuthService.processTeacherDataFromUrl - INICIANDO (STATIC)")

    try {
      const urlParams = new URLSearchParams(window.location.search)
      console.log(
        "🔍 TeacherAuthService.processTeacherDataFromUrl - URL params encontrados:",
        Object.fromEntries(urlParams.entries()),
      )

      const idDocente = urlParams.get("id_docente")
      const usuarioDocente = urlParams.get("usuario_docente")
      const nombreDocente = urlParams.get("nombre_docente")
      const apellidosDocente = urlParams.get("apellidos_docente")
      const correoDocente = urlParams.get("correo_docente")
      const authSource = urlParams.get("auth_source")

      console.log("🔍 TeacherAuthService.processTeacherDataFromUrl - Parámetros extraídos:", {
        idDocente,
        usuarioDocente,
        nombreDocente,
        apellidosDocente,
        correoDocente,
        authSource,
      })

      if (
        !idDocente ||
        !usuarioDocente ||
        !nombreDocente ||
        !apellidosDocente ||
        !correoDocente ||
        authSource !== "front-login"
      ) {
        console.log(
          "❌ TeacherAuthService.processTeacherDataFromUrl - Faltan parámetros necesarios o fuente incorrecta",
        )
        return null
      }

      const teacherTokens: TeacherTokens = {
        id: Number.parseInt(idDocente),
        usuario: usuarioDocente,
        nombre: nombreDocente,
        apellidos: apellidosDocente,
        correo: correoDocente,
        auth_source: authSource,
      }

      console.log("✅ TeacherAuthService.processTeacherDataFromUrl - Datos procesados exitosamente")
      console.log("📤 TeacherAuthService.processTeacherDataFromUrl - RETORNANDO datos")
      return teacherTokens
    } catch (error) {
      console.error("💥 TeacherAuthService.processTeacherDataFromUrl - ERROR:", error)
      return null
    }
  }

  // Función estática para limpiar URL después de procesar datos
  static cleanUrlAfterTeacherDataProcessing(): void {
    console.log("🧹 TeacherAuthService.cleanUrlAfterTeacherDataProcessing - INICIANDO (STATIC)")

    try {
      const url = new URL(window.location.href)

      // Remover parámetros de autenticación del docente
      url.searchParams.delete("id_docente")
      url.searchParams.delete("usuario_docente")
      url.searchParams.delete("nombre_docente")
      url.searchParams.delete("apellidos_docente")
      url.searchParams.delete("correo_docente")
      url.searchParams.delete("auth_source")
      url.searchParams.delete("timestamp")

      const cleanUrl = url.toString()
      console.log("🧹 TeacherAuthService.cleanUrlAfterTeacherDataProcessing - URL limpia:", cleanUrl)

      // Actualizar URL sin recargar la página
      window.history.replaceState({}, document.title, cleanUrl)
      console.log("✅ TeacherAuthService.cleanUrlAfterTeacherDataProcessing - URL actualizada")
    } catch (error) {
      console.error("💥 TeacherAuthService.cleanUrlAfterTeacherDataProcessing - ERROR:", error)
    }
  }
}

export const teacherAuthService = new TeacherAuthService()
export { TeacherAuthService }
console.log("🏗️ TeacherAuthService - Instancia creada:", teacherAuthService)
