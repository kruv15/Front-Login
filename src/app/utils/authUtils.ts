import { AuthService, type AuthTokens, type User } from "../services/authService"

/**
 * Utilidades para manejo de autenticación entre dominios
 * Este archivo puede ser copiado a Front-Administrador
 */

export interface CrossDomainAuthResult {
  success: boolean
  user: User | null
  tokens: AuthTokens | null
  error?: string
}

/**
 * Función principal para inicializar autenticación en Front-Administrador
 * Debe ser llamada al cargar la aplicación
 */
export function initializeCrossDomainAuth(): CrossDomainAuthResult {
  console.log("🔄 AuthUtils.initializeCrossDomainAuth - INICIANDO")

  try {
    // 1. Intentar obtener tokens de la URL (viene de Front-Login)
    console.log("🔍 AuthUtils.initializeCrossDomainAuth - Buscando tokens en URL...")
    const tokensFromUrl = AuthService.processTokensFromUrl()

    if (tokensFromUrl) {
      console.log("✅ AuthUtils.initializeCrossDomainAuth - Tokens encontrados en URL")
      console.log("💾 AuthUtils.initializeCrossDomainAuth - Guardando tokens en localStorage...")

      // Guardar tokens en localStorage del dominio actual
      localStorage.setItem("access_token", tokensFromUrl.access_token)
      localStorage.setItem("refresh_token", tokensFromUrl.refresh_token)
      localStorage.setItem("user_data", JSON.stringify(tokensFromUrl.user_data))
      localStorage.setItem("user_role", tokensFromUrl.user_role)

      console.log("✅ AuthUtils.initializeCrossDomainAuth - Tokens guardados")
      console.log("🧹 AuthUtils.initializeCrossDomainAuth - Limpiando URL...")

      // Limpiar URL
      AuthService.cleanUrlAfterTokenProcessing()

      return {
        success: true,
        user: tokensFromUrl.user_data,
        tokens: tokensFromUrl,
      }
    }

    // 2. Si no hay tokens en URL, verificar localStorage local
    console.log("🔍 AuthUtils.initializeCrossDomainAuth - No hay tokens en URL, verificando localStorage...")
    const localAccessToken = localStorage.getItem("access_token")
    const localUserData = localStorage.getItem("user_data")

    if (localAccessToken && localUserData) {
      console.log("✅ AuthUtils.initializeCrossDomainAuth - Tokens encontrados en localStorage")

      const userData = JSON.parse(localUserData)
      const tokens: AuthTokens = {
        access_token: localAccessToken,
        refresh_token: localStorage.getItem("refresh_token") || "",
        user_data: userData,
        user_role: localStorage.getItem("user_role") || "",
      }

      return {
        success: true,
        user: userData,
        tokens: tokens,
      }
    }

    // 3. No hay autenticación
    console.log("❌ AuthUtils.initializeCrossDomainAuth - No se encontró autenticación")
    return {
      success: false,
      user: null,
      tokens: null,
      error: "No authentication found",
    }
  } catch (error) {
    console.error("💥 AuthUtils.initializeCrossDomainAuth - ERROR:", error)
    return {
      success: false,
      user: null,
      tokens: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Verificar si el usuario está autenticado
 */
export function isUserAuthenticated(): boolean {
  console.log("🔐 AuthUtils.isUserAuthenticated - INICIANDO")

  const accessToken = localStorage.getItem("access_token")
  const userData = localStorage.getItem("user_data")

  const result = !!(accessToken && userData)
  console.log("📤 AuthUtils.isUserAuthenticated - RETORNANDO:", result)
  return result
}

/**
 * Obtener datos del usuario actual
 */
export function getCurrentUserData(): User | null {
  console.log("👤 AuthUtils.getCurrentUserData - INICIANDO")

  try {
    const userData = localStorage.getItem("user_data")
    const result = userData ? JSON.parse(userData) : null
    console.log("📤 AuthUtils.getCurrentUserData - RETORNANDO:", result)
    return result
  } catch (error) {
    console.error("💥 AuthUtils.getCurrentUserData - ERROR:", error)
    return null
  }
}

/**
 * Redirigir de vuelta a Front-Login si no está autenticado
 */
export function redirectToLogin(): void {
  console.log("🔄 AuthUtils.redirectToLogin - REDIRIGIENDO A FRONT-LOGIN")
  window.location.href = "https://front-loginv1.vercel.app"
}

/**
 * Cerrar sesión y redirigir a Front-Login
 */
export function logoutAndRedirect(): void {
  console.log("🚪 AuthUtils.logoutAndRedirect - INICIANDO")

  // Limpiar localStorage
  localStorage.removeItem("access_token")
  localStorage.removeItem("refresh_token")
  localStorage.removeItem("user_data")
  localStorage.removeItem("user_role")

  console.log("🧹 AuthUtils.logoutAndRedirect - localStorage limpiado")

  // Redirigir a Front-Login
  redirectToLogin()
}

/**
 * Hacer llamadas autenticadas a la API
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  console.log("📡 AuthUtils.authenticatedFetch - INICIANDO")
  console.log("📥 AuthUtils.authenticatedFetch - URL:", url)

  const accessToken = localStorage.getItem("access_token")
  console.log(
    "🔍 AuthUtils.authenticatedFetch - Access token:",
    accessToken ? accessToken.substring(0, 50) + "..." : "null",
  )

  if (!accessToken) {
    console.log("❌ AuthUtils.authenticatedFetch - No hay access token, redirigiendo al login")
    redirectToLogin()
    throw new Error("No access token available")
  }

  // Primera llamada
  console.log("📡 AuthUtils.authenticatedFetch - Haciendo primera llamada...")
  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  console.log("📨 AuthUtils.authenticatedFetch - Response status:", response.status)

  // Si el token expiró (401), intentar renovar
  if (response.status === 401) {
    console.log("🔄 AuthUtils.authenticatedFetch - Token expirado, intentando renovar...")

    const refreshToken = localStorage.getItem("refresh_token")
    if (!refreshToken) {
      console.log("❌ AuthUtils.authenticatedFetch - No hay refresh token")
      redirectToLogin()
      throw new Error("No refresh token available")
    }

    console.log("📡 AuthUtils.authenticatedFetch - Renovando token...")
    const refreshResponse = await fetch("https://microservice-admin.onrender.com/api/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
    })

    console.log("📨 AuthUtils.authenticatedFetch - Refresh response status:", refreshResponse.status)

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json()
      console.log("✅ AuthUtils.authenticatedFetch - Token renovado exitosamente")

      localStorage.setItem("access_token", refreshData.data.access_token)

      // Reintentar llamada original con nuevo token
      console.log("🔄 AuthUtils.authenticatedFetch - Reintentando llamada original...")
      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${refreshData.data.access_token}`,
          "Content-Type": "application/json",
        },
      })

      console.log("📨 AuthUtils.authenticatedFetch - Retry response status:", response.status)
    } else {
      console.log("❌ AuthUtils.authenticatedFetch - No se pudo renovar token, redirigiendo al login")
      // Refresh token también expiró, redirigir al login
      logoutAndRedirect()
      throw new Error("Token refresh failed")
    }
  }

  console.log("📤 AuthUtils.authenticatedFetch - RETORNANDO response")
  return response
}
