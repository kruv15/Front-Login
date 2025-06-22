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

class AuthService {
  private getApiUrl(role: string): string {
    // Por ahora solo tenemos el backend de administrador
    // En el futuro se pueden agregar otros backends
    switch (role) {
      case "administrador":
        return `${API_BASE_URL}/auth/login`
      case "docente":
        // TODO: Implementar cuando esté disponible
        return `${API_BASE_URL}/auth/login`
      case "estudiante":
        // TODO: Implementar cuando esté disponible
        return `${API_BASE_URL}/auth/login`
      default:
        return `${API_BASE_URL}/auth/login`
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(this.getApiUrl(credentials.role), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      })

      const data: AuthResponse = await response.json()

      if (data.success && data.data) {
        // Guardar tokens y datos del usuario
        localStorage.setItem("access_token", data.data.access_token)
        localStorage.setItem("refresh_token", data.data.refresh_token)
        localStorage.setItem("user_role", credentials.role)

        if (data.data.admin) {
          localStorage.setItem("user_data", JSON.stringify(data.data.admin))
        }
      }

      return data
    } catch (error) {
      console.error("Error en login:", error)
      return {
        success: false,
        message: "Error de conexión con el servidor",
        data: null,
      }
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem("refresh_token")
      if (!refreshToken) return false

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success && data.data) {
        localStorage.setItem("access_token", data.data.access_token)
        return true
      }

      return false
    } catch (error) {
      console.error("Error al renovar token:", error)
      return false
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const accessToken = localStorage.getItem("access_token")
      if (!accessToken) return null

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (response.status === 401) {
        // Token expirado, intentar renovar
        const refreshed = await this.refreshToken()
        if (refreshed) {
          // Reintentar con el nuevo token
          return this.getCurrentUser()
        } else {
          // No se pudo renovar, limpiar sesión
          this.logout()
          return null
        }
      }

      const data = await response.json()
      return data.success ? data.data : null
    } catch (error) {
      console.error("Error al obtener usuario actual:", error)
      return null
    }
  }

  async logout(): Promise<void> {
    try {
      const accessToken = localStorage.getItem("access_token")
      const refreshToken = localStorage.getItem("refresh_token")

      if (accessToken) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        })
      }
    } catch (error) {
      console.error("Error en logout:", error)
    } finally {
      // Limpiar almacenamiento local
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user_data")
      localStorage.removeItem("user_role")
      sessionStorage.clear()
    }
  }

  getStoredUser(): User | null {
    try {
      const userData = localStorage.getItem("user_data")
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  getStoredRole(): string | null {
    return localStorage.getItem("user_role")
  }

  isAuthenticated(): boolean {
    const accessToken = localStorage.getItem("access_token")
    const userData = localStorage.getItem("user_data")
    return !!(accessToken && userData)
  }

  redirectToRoleFrontend(role: string): void {
    const url = FRONTEND_URLS[role as keyof typeof FRONTEND_URLS]
    if (url) {
      // Redirección a frontend externo
      window.location.href = url
    } else {
      console.warn(`No hay URL configurada para el rol: ${role}`)
      // Fallback a rutas internas
      window.location.href = `/${role}`
    }
  }

  // Verificar si hay conflicto de sesiones (diferentes roles)
  checkSessionConflict(newRole: string): boolean {
    const currentRole = this.getStoredRole()
    return !!(currentRole && currentRole !== newRole && this.isAuthenticated())
  }
}

export const authService = new AuthService()
