"use client"

import type React from "react"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { authService, type User } from "../services/authService"

interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isLoading: boolean
  logout: () => Promise<void>
  checkAndRedirectIfAuthenticated: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // Si viene de un logout externo, limpiar localStorage manualmente
    const url = new URL(window.location.href)
    const justLoggedOut = url.searchParams.get("logged_out")

    if (justLoggedOut === "true") {
      console.log("🔄 Login: Detectado return de logout externo, limpiando localStorage...")

      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      localStorage.removeItem("user_data")
      localStorage.removeItem("user_role")
      localStorage.removeItem("auth_source")
      localStorage.removeItem("auth_timestamp")

      // Limpiar la URL
      url.searchParams.delete("logged_out")
      window.history.replaceState({}, document.title, url.pathname + url.search)
    }
  }, [])

  console.log("🏗️ UserContextProvider - INICIANDO PROVIDER")

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  console.log("📊 UserContextProvider - Estado inicial:", { user, isLoading })

  // Verificar sesión existente al cargar la aplicación
  useEffect(() => {
    console.log("🔄 UserContextProvider - useEffect INICIANDO")

    const checkExistingSession = async () => {
      console.log("🔍 UserContextProvider - checkExistingSession INICIANDO")

      try {
        console.log("🔐 UserContextProvider - Verificando si está autenticado...")
        const isAuth = authService.isAuthenticated()
        console.log("🔐 UserContextProvider - isAuthenticated resultado:", isAuth)

        if (isAuth) {
          console.log("✅ UserContextProvider - Usuario autenticado, obteniendo datos...")
          const currentUser = await authService.getCurrentUser()
          console.log("👤 UserContextProvider - getCurrentUser resultado:", currentUser)

          if (currentUser) {
            console.log("✅ UserContextProvider - Datos de usuario obtenidos, actualizando estado...")
            setUser(currentUser)

            // Si hay una sesión válida, redirigir automáticamente
            const role = authService.getStoredRole()
            console.log("🎭 UserContextProvider - Rol obtenido:", role)

            if (role) {
              console.log("🌐 UserContextProvider - Redirigiendo automáticamente...")
              authService.redirectToRoleFrontend(role)
              return
            } else {
              console.log("⚠️ UserContextProvider - No se encontró rol para redirección")
            }
          } else {
            console.log("❌ UserContextProvider - No se pudieron obtener datos del usuario")
          }
        } else {
          console.log("❌ UserContextProvider - Usuario no autenticado")
        }
      } catch (error) {
        console.error("💥 UserContextProvider - Error al verificar sesión existente:", error)
      } finally {
        console.log("🏁 UserContextProvider - Finalizando verificación, setIsLoading(false)")
        setIsLoading(false)
      }
    }

    checkExistingSession()
  }, [])

  const logout = async () => {
    console.log("🚪 UserContextProvider - logout INICIANDO")

    try {
      console.log("📡 UserContextProvider - Llamando authService.logout()...")
      await authService.logout()
      console.log("✅ UserContextProvider - authService.logout() completado")

      console.log("🧹 UserContextProvider - Limpiando estado del usuario...")
      setUser(null)
      console.log("✅ UserContextProvider - Estado limpiado")

      // Recargar la página para limpiar cualquier estado residual
      console.log("🔄 UserContextProvider - Recargando página...")
      window.location.href = "/"
    } catch (error) {
      console.error("💥 UserContextProvider - Error durante logout:", error)
    }
  }

  const checkAndRedirectIfAuthenticated = () => {
    console.log("🔍 UserContextProvider - checkAndRedirectIfAuthenticated INICIANDO")

    const isAuth = authService.isAuthenticated()
    console.log("🔐 UserContextProvider - isAuthenticated resultado:", isAuth)

    if (isAuth) {
      console.log("✅ UserContextProvider - Usuario autenticado, obteniendo rol...")
      const role = authService.getStoredRole()
      console.log("🎭 UserContextProvider - Rol obtenido:", role)

      if (role) {
        console.log("🌐 UserContextProvider - Redirigiendo...")
        authService.redirectToRoleFrontend(role)
      } else {
        console.log("⚠️ UserContextProvider - No se encontró rol")
      }
    } else {
      console.log("❌ UserContextProvider - Usuario no autenticado, no se redirige")
    }
  }

  const contextValue = {
    user,
    setUser,
    isLoading,
    logout,
    checkAndRedirectIfAuthenticated,
  }

  console.log("📤 UserContextProvider - Proporcionando contexto:", contextValue)

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
}

export const useUserContext = () => {
  console.log("🪝 useUserContext - INICIANDO")

  const context = useContext(UserContext)
  console.log("🔍 useUserContext - Contexto obtenido:", context)

  if (!context) {
    console.error("💥 useUserContext - ERROR: Contexto no encontrado")
    throw new Error("useUserContext must be used within a UserContextProvider")
  }

  console.log("📤 useUserContext - RETORNANDO contexto")
  return context
}
