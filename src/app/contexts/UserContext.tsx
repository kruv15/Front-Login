"use client"

import type React from "react"

import { createContext, useContext, useState, type ReactNode, useEffect } from "react"
import { authService, type User } from "../services/authService"
import { studentAuthService } from "../services/studentAuthService"

interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  isLoading: boolean
  logout: () => Promise<void>
  checkAndRedirectIfAuthenticated: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    console.log("🔄 UserContextProvider - useEffect INICIANDO")
    // ⏱️ 1. Limpiar sincronamente antes de cualquier async
    const url = new URL(window.location.href)
    const justLoggedOut = url.searchParams.get("logged_out")

    if (justLoggedOut === "true") {
      console.log("🧹 UserContextProvider - Limpiando localStorage por logout externo")

      const keys = ["access_token", "refresh_token", "user_data", "user_role", "auth_source", "auth_timestamp"]
      keys.forEach((key) => localStorage.removeItem(key))
      sessionStorage.clear()

      // Limpiar datos de estudiante si viene de logout
      if (justLoggedOut === "true") {
        console.log("🧹 UserContextProvider - Limpiando datos de estudiante por logout externo")
        localStorage.removeItem("id_estudiante")
        localStorage.removeItem("correo_estudiante")
        localStorage.removeItem("nombre_estudiante")
        localStorage.removeItem("student_auth_source")
      }

      url.searchParams.delete("logged_out")
      window.history.replaceState({}, document.title, url.pathname + url.search)
    }
    // ✅ 2. Luego verificar sesión
    const checkExistingSession = async () => {
      console.log("🔍 Verificando si existe un token en localStorage…")

      // 1️⃣ Early-return: si no hay access_token, no seguimos haciendo llamadas
      const token = localStorage.getItem("access_token")
      if (!token) {
        console.log("❌ No hay access_token - terminamos verificación.")
        setIsLoading(false)
        return // ← importante: salimos de la función
      }

      // 2️⃣ Con token presente, sigue tu lógica habitual
      try {
        const isAuth = authService.isAuthenticated()
        console.log("🔐 isAuthenticated resultado:", isAuth)

        if (isAuth) {
          const currentUser = await authService.getCurrentUser()
          console.log("👤 Usuario obtenido:", currentUser)
          if (currentUser) {
            setUser(currentUser)
            const role = authService.getStoredRole()
            if (role) {
              authService.redirectToRoleFrontend(role)
              return
            }
          }
        } else {
          console.log("❌ Usuario no autenticado")
        }
      } catch (error) {
        console.error("💥 Error al verificar sesión:", error)
        localStorage.clear()
      } finally {
        setIsLoading(false)
      }

      // Verificar si hay sesión de estudiante activa
      if (studentAuthService.isStudentAuthenticated()) {
        console.log("🎓 UserContextProvider - Sesión de estudiante encontrada, redirigiendo...")
        studentAuthService.redirectToStudentFrontendWithData()
        return
      }
    }

    checkExistingSession()
  }, [])

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      window.location.href = "/"
    } catch (error) {
      console.error("💥 Error durante logout:", error)
    }
  }

  const checkAndRedirectIfAuthenticated = () => {
    const isAuth = authService.isAuthenticated()
    if (isAuth) {
      const role = authService.getStoredRole()
      if (role) {
        authService.redirectToRoleFrontend(role)
      }
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logout, checkAndRedirectIfAuthenticated }}>
      {children}
    </UserContext.Provider>
  )
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
