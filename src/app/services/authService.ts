// Configuración de URLs
const API_BASE_URL = "https://microservice-admin.onrender.com/api"

// URLs de redirección según el rol
const FRONTEND_URLS = {
  administrador: "https://front-adminv1.vercel.app",
  docente: "https://front-docentev1.vercel.app", // URL pendiente
  estudiante: "https://front-estudiantev1.vercel.app", // URL pendiente
}

export interface LoginCredentials {
  email: string
  password: string
  role: "administrador" | "docente" | "estudiante"
}

export interface User {
  _id: string
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  created_at: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    admin?: User
    access_token: string
    refresh_token: string
  } | null
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  user_data: User
  user_role: string
}

class AuthService {
  private getApiUrl(role: string): string {
    console.log("🔗 AuthService.getApiUrl - INPUT:", { role })

    // Por ahora solo tenemos el backend de administrador
    // En el futuro se pueden agregar otros backends
    let apiUrl: string
    switch (role) {
      case "administrador":
        apiUrl = `${API_BASE_URL}/auth/login`
        break
      case "docente":
        // TODO: Implementar cuando esté disponible
        apiUrl = `${API_BASE_URL}/auth/login`
        break
      case "estudiante":
        // TODO: Implementar cuando esté disponible
        apiUrl = `${API_BASE_URL}/auth/login`
        break
      default:
        apiUrl = `${API_BASE_URL}/auth/login`
        break
    }

    console.log("🔗 AuthService.getApiUrl - OUTPUT:", { apiUrl })
    return apiUrl
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log("🚀 AuthService.login - INICIANDO LOGIN")
    console.log("📥 AuthService.login - INPUT credentials:", credentials)

    try {
      const apiUrl = this.getApiUrl(credentials.role)
      console.log("🌐 AuthService.login - API URL:", apiUrl)

      const requestBody = {
        email: credentials.email,
        password: credentials.password,
      }
      console.log("📤 AuthService.login - REQUEST BODY:", requestBody)

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include" as RequestCredentials,
        body: JSON.stringify(requestBody),
      }
      console.log("⚙️ AuthService.login - REQUEST OPTIONS:", requestOptions)

      console.log("📡 AuthService.login - Enviando request al backend...")
      const response = await fetch(apiUrl, requestOptions)
      console.log("📨 AuthService.login - RESPONSE STATUS:", response.status)
      console.log("📨 AuthService.login - RESPONSE HEADERS:", Object.fromEntries(response.headers.entries()))

      const data: AuthResponse = await response.json()
      console.log("📋 AuthService.login - RESPONSE DATA:", data)

      if (data.success && data.data) {
        console.log("✅ AuthService.login - LOGIN EXITOSO")
        console.log("💾 AuthService.login - Guardando tokens en localStorage local...")

        // Guardar tokens y datos del usuario EN EL DOMINIO ACTUAL (Front-Login)
        localStorage.setItem("access_token", data.data.access_token)
        console.log("💾 AuthService.login - access_token guardado:", data.data.access_token.substring(0, 50) + "...")

        localStorage.setItem("refresh_token", data.data.refresh_token)
        console.log("💾 AuthService.login - refresh_token guardado:", data.data.refresh_token.substring(0, 50) + "...")

        localStorage.setItem("user_role", credentials.role)
        console.log("💾 AuthService.login - user_role guardado:", credentials.role)

        if (data.data.admin) {
          localStorage.setItem("user_data", JSON.stringify(data.data.admin))
          console.log("💾 AuthService.login - user_data guardado:", data.data.admin)
        }

        console.log("💾 AuthService.login - Todos los datos guardados en localStorage LOCAL")
      } else {
        console.log("❌ AuthService.login - LOGIN FALLIDO")
        console.log("❌ AuthService.login - Razón:", data.message)
      }

      console.log("📤 AuthService.login - RETORNANDO RESPONSE:", data)
      return data
    } catch (error) {
      console.error("💥 AuthService.login - ERROR CAPTURADO:", error)
      const errorResponse = {
        success: false,
        message: "Error de conexión con el servidor",
        data: null,
      }
      console.log("📤 AuthService.login - RETORNANDO ERROR RESPONSE:", errorResponse)
      return errorResponse
    }
  }

  async refreshToken(): Promise<boolean> {
    console.log("🔄 AuthService.refreshToken - INICIANDO REFRESH")

    try {
      const refreshToken = localStorage.getItem("refresh_token")
      console.log(
        "🔍 AuthService.refreshToken - refresh_token desde localStorage:",
        refreshToken ? refreshToken.substring(0, 50) + "..." : "null",
      )

      if (!refreshToken) {
        console.log("❌ AuthService.refreshToken - No hay refresh_token")
        return false
      }

      const requestOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      }
      console.log("⚙️ AuthService.refreshToken - REQUEST OPTIONS:", requestOptions)

      console.log("📡 AuthService.refreshToken - Enviando request...")
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, requestOptions)
      console.log("📨 AuthService.refreshToken - RESPONSE STATUS:", response.status)

      const data = await response.json()
      console.log("📋 AuthService.refreshToken - RESPONSE DATA:", data)

      if (data.success && data.data) {
        console.log("✅ AuthService.refreshToken - REFRESH EXITOSO")
        localStorage.setItem("access_token", data.data.access_token)
        console.log(
          "💾 AuthService.refreshToken - Nuevo access_token guardado:",
          data.data.access_token.substring(0, 50) + "...",
        )
        return true
      }

      console.log("❌ AuthService.refreshToken - REFRESH FALLIDO")
      return false
    } catch (error) {
      console.error("💥 AuthService.refreshToken - ERROR:", error)
      return false
    }
  }

  async getCurrentUser(): Promise<User | null> {
    console.log("👤 AuthService.getCurrentUser - INICIANDO")

    try {
      const accessToken = localStorage.getItem("access_token")
      console.log(
        "🔍 AuthService.getCurrentUser - access_token:",
        accessToken ? accessToken.substring(0, 50) + "..." : "null",
      )

      if (!accessToken) {
        console.log("❌ AuthService.getCurrentUser - No hay access_token")
        return null
      }

      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
      console.log("⚙️ AuthService.getCurrentUser - REQUEST OPTIONS:", requestOptions)

      console.log("📡 AuthService.getCurrentUser - Enviando request...")
      const response = await fetch(`${API_BASE_URL}/auth/me`, requestOptions)
      console.log("📨 AuthService.getCurrentUser - RESPONSE STATUS:", response.status)

      if (response.status === 401) {
        console.log("🔄 AuthService.getCurrentUser - Token expirado, intentando renovar...")
        // Token expirado, intentar renovar
        const refreshed = await this.refreshToken()
        console.log("🔄 AuthService.getCurrentUser - Resultado del refresh:", refreshed)

        if (refreshed) {
          console.log("🔄 AuthService.getCurrentUser - Reintentando con nuevo token...")
          // Reintentar con el nuevo token
          return this.getCurrentUser()
        } else {
          console.log("❌ AuthService.getCurrentUser - No se pudo renovar, limpiando sesión...")
          // No se pudo renovar, limpiar sesión
          this.logout()
          return null
        }
      }

      const data = await response.json()
      console.log("📋 AuthService.getCurrentUser - RESPONSE DATA:", data)

      const result = data.success ? data.data : null
      console.log("📤 AuthService.getCurrentUser - RETORNANDO:", result)
      return result
    } catch (error) {
      console.error("💥 AuthService.getCurrentUser - ERROR:", error)
      return null
    }
  }

  async logout(): Promise<void> {
    console.log("🚪 AuthService.logout - INICIANDO LOGOUT")

    try {
      const accessToken = localStorage.getItem("access_token")
      const refreshToken = localStorage.getItem("refresh_token")
      console.log("🔍 AuthService.logout - Tokens encontrados:", {
        accessToken: accessToken ? accessToken.substring(0, 50) + "..." : "null",
        refreshToken: refreshToken ? refreshToken.substring(0, 50) + "..." : "null",
      })

      if (accessToken) {
        console.log("📡 AuthService.logout - Enviando logout al backend...")
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        })
        console.log("📨 AuthService.logout - RESPONSE STATUS:", response.status)
      }
    } catch (error) {
      console.error("💥 AuthService.logout - ERROR:", error)
    } finally {
      console.log("🧹 AuthService.logout - Limpiando localStorage...")
      // Limpiar almacenamiento local
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user_data")
      localStorage.removeItem("user_role")
      localStorage.removeItem("auth_source")
      localStorage.removeItem("auth_timestamp")
      sessionStorage.clear()
      console.log("✅ AuthService.logout - localStorage limpiado")
      setTimeout(() => {
        window.location.href = "https://front-loginv1.vercel.app/?logged_out=true"
      }, 500)
    }
  }

  getStoredUser(): User | null {
    console.log("📦 AuthService.getStoredUser - INICIANDO")

    try {
      const userData = localStorage.getItem("user_data")
      console.log("🔍 AuthService.getStoredUser - user_data raw:", userData)

      const result = userData ? JSON.parse(userData) : null
      console.log("📤 AuthService.getStoredUser - RETORNANDO:", result)
      return result
    } catch (error) {
      console.error("💥 AuthService.getStoredUser - ERROR:", error)
      return null
    }
  }

  getStoredRole(): string | null {
    console.log("🎭 AuthService.getStoredRole - INICIANDO")

    const role = localStorage.getItem("user_role")
    console.log("📤 AuthService.getStoredRole - RETORNANDO:", role)
    return role
  }

  isAuthenticated(): boolean {
    console.log("🔐 AuthService.isAuthenticated - INICIANDO")

    const accessToken = localStorage.getItem("access_token")
    const userData = localStorage.getItem("user_data")

    console.log("🔍 AuthService.isAuthenticated - Verificando tokens:", {
      hasAccessToken: !!accessToken,
      hasUserData: !!userData,
      accessToken: accessToken ? accessToken.substring(0, 50) + "..." : "null",
    })

    const result = !!(accessToken && userData)
    console.log("📤 AuthService.isAuthenticated - RETORNANDO:", result)
    return result
  }

  // NUEVA FUNCIÓN: Crear URL con tokens como query parameters
  private createAuthenticatedUrl(baseUrl: string, tokens: AuthTokens): string {
    console.log("🔗 AuthService.createAuthenticatedUrl - INICIANDO")
    console.log("📥 AuthService.createAuthenticatedUrl - INPUT:", {
      baseUrl,
      tokens: {
        access_token: tokens.access_token.substring(0, 50) + "...",
        refresh_token: tokens.refresh_token.substring(0, 50) + "...",
        user_data: tokens.user_data,
        user_role: tokens.user_role,
      },
    })

    try {
      const url = new URL(baseUrl)

      // Agregar tokens como query parameters
      url.searchParams.set("access_token", tokens.access_token)
      url.searchParams.set("refresh_token", tokens.refresh_token)
      url.searchParams.set("user_data", JSON.stringify(tokens.user_data))
      url.searchParams.set("user_role", tokens.user_role)
      url.searchParams.set("auth_source", "front-login") // Para identificar el origen
      url.searchParams.set("timestamp", Date.now().toString()) // Para evitar cache

      const finalUrl = url.toString()
      console.log("🔗 AuthService.createAuthenticatedUrl - URL CREADA:", finalUrl.substring(0, 100) + "...")
      console.log("📤 AuthService.createAuthenticatedUrl - RETORNANDO URL completa")

      return finalUrl
    } catch (error) {
      console.error("💥 AuthService.createAuthenticatedUrl - ERROR:", error)
      console.log("🔄 AuthService.createAuthenticatedUrl - Retornando URL base como fallback")
      return baseUrl
    }
  }

  // FUNCIÓN ACTUALIZADA: Redirigir con tokens en query string
  redirectToRoleFrontendWithTokens(role: string): void {
    console.log("🌐 AuthService.redirectToRoleFrontendWithTokens - INICIANDO")
    console.log("📥 AuthService.redirectToRoleFrontendWithTokens - INPUT role:", role)

    const baseUrl = FRONTEND_URLS[role as keyof typeof FRONTEND_URLS]
    console.log("🔍 AuthService.redirectToRoleFrontendWithTokens - Base URL encontrada:", baseUrl)

    if (!baseUrl) {
      console.warn("⚠️ AuthService.redirectToRoleFrontendWithTokens - No hay URL configurada para el rol:", role)
      // Fallback a rutas internas
      const fallbackUrl = `/${role}`
      console.log("🔄 AuthService.redirectToRoleFrontendWithTokens - Usando fallback:", fallbackUrl)
      window.location.href = fallbackUrl
      return
    }

    // Obtener tokens del localStorage
    const accessToken = localStorage.getItem("access_token")
    const refreshToken = localStorage.getItem("refresh_token")
    const userData = localStorage.getItem("user_data")
    const userRole = localStorage.getItem("user_role")

    console.log("🔍 AuthService.redirectToRoleFrontendWithTokens - Tokens obtenidos:", {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasUserData: !!userData,
      userRole,
    })

    if (!accessToken || !refreshToken || !userData || !userRole) {
      console.error("❌ AuthService.redirectToRoleFrontendWithTokens - Faltan tokens necesarios")
      console.log("🔄 AuthService.redirectToRoleFrontendWithTokens - Redirigiendo sin tokens")
      window.location.href = baseUrl
      return
    }

    try {
      const parsedUserData = JSON.parse(userData)
      console.log("👤 AuthService.redirectToRoleFrontendWithTokens - User data parseada:", parsedUserData)

      const tokens: AuthTokens = {
        access_token: accessToken,
        refresh_token: refreshToken,
        user_data: parsedUserData,
        user_role: userRole,
      }

      // Crear URL con tokens
      const authenticatedUrl = this.createAuthenticatedUrl(baseUrl, tokens)
      console.log("✅ AuthService.redirectToRoleFrontendWithTokens - URL autenticada creada")

      // Limpiar localStorage local antes de redirigir (opcional)
      console.log("🧹 AuthService.redirectToRoleFrontendWithTokens - Limpiando localStorage local...")
      this.logout()

      console.log("🚀 AuthService.redirectToRoleFrontendWithTokens - REDIRIGIENDO...")
      // Redirigir con tokens en la URL
      window.location.href = authenticatedUrl
    } catch (error) {
      console.error("💥 AuthService.redirectToRoleFrontendWithTokens - ERROR al parsear user data:", error)
      console.log("🔄 AuthService.redirectToRoleFrontendWithTokens - Redirigiendo sin tokens como fallback")
      window.location.href = baseUrl
    }
  }

  // FUNCIÓN LEGACY: Mantener compatibilidad
  redirectToRoleFrontend(role: string): void {
    console.log("🌐 AuthService.redirectToRoleFrontend - REDIRIGIENDO A NUEVA FUNCIÓN")
    this.redirectToRoleFrontendWithTokens(role)
  }

  // Verificar si hay conflicto de sesiones (diferentes roles)
  checkSessionConflict(newRole: string): boolean {
    console.log("⚔️ AuthService.checkSessionConflict - INICIANDO")
    console.log("📥 AuthService.checkSessionConflict - INPUT newRole:", newRole)

    const currentRole = this.getStoredRole()
    const isAuthenticated = this.isAuthenticated()

    console.log("🔍 AuthService.checkSessionConflict - Estado actual:", {
      currentRole,
      newRole,
      isAuthenticated,
    })

    const hasConflict = !!(currentRole && currentRole !== newRole && isAuthenticated)
    console.log("📤 AuthService.checkSessionConflict - RETORNANDO:", hasConflict)
    return hasConflict
  }

  // NUEVA FUNCIÓN: Para que Front-Administrador pueda procesar tokens de la URL
  static processTokensFromUrl(): AuthTokens | null {
    console.log("🔍 AuthService.processTokensFromUrl - INICIANDO (STATIC)")

    try {
      const urlParams = new URLSearchParams(window.location.search)
      console.log(
        "🔍 AuthService.processTokensFromUrl - URL params encontrados:",
        Object.fromEntries(urlParams.entries()),
      )

      const accessToken = urlParams.get("access_token")
      const refreshToken = urlParams.get("refresh_token")
      const userDataStr = urlParams.get("user_data")
      const userRole = urlParams.get("user_role")
      const authSource = urlParams.get("auth_source")

      console.log("🔍 AuthService.processTokensFromUrl - Parámetros extraídos:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        hasUserData: !!userDataStr,
        userRole,
        authSource,
      })

      if (!accessToken || !refreshToken || !userDataStr || !userRole || authSource !== "front-login") {
        console.log("❌ AuthService.processTokensFromUrl - Faltan parámetros necesarios o fuente incorrecta")
        return null
      }

      const userData = JSON.parse(userDataStr)
      console.log("👤 AuthService.processTokensFromUrl - User data parseada:", userData)

      const tokens: AuthTokens = {
        access_token: accessToken,
        refresh_token: refreshToken,
        user_data: userData,
        user_role: userRole,
      }

      console.log("✅ AuthService.processTokensFromUrl - Tokens procesados exitosamente")
      console.log("📤 AuthService.processTokensFromUrl - RETORNANDO tokens")
      return tokens
    } catch (error) {
      console.error("💥 AuthService.processTokensFromUrl - ERROR:", error)
      return null
    }
  }

  // NUEVA FUNCIÓN: Limpiar URL después de procesar tokens
  static cleanUrlAfterTokenProcessing(): void {
    console.log("🧹 AuthService.cleanUrlAfterTokenProcessing - INICIANDO (STATIC)")

    try {
      const url = new URL(window.location.href)

      // Remover parámetros de autenticación
      url.searchParams.delete("access_token")
      url.searchParams.delete("refresh_token")
      url.searchParams.delete("user_data")
      url.searchParams.delete("user_role")
      url.searchParams.delete("auth_source")
      url.searchParams.delete("timestamp")

      const cleanUrl = url.toString()
      console.log("🧹 AuthService.cleanUrlAfterTokenProcessing - URL limpia:", cleanUrl)

      // Actualizar URL sin recargar la página
      window.history.replaceState({}, document.title, cleanUrl)
      console.log("✅ AuthService.cleanUrlAfterTokenProcessing - URL actualizada")
    } catch (error) {
      console.error("💥 AuthService.cleanUrlAfterTokenProcessing - ERROR:", error)
    }
  }
}

export const authService = new AuthService()
export { AuthService }
console.log("🏗️ AuthService - Instancia creada:", authService)
