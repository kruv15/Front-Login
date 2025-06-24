"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { FaUserGraduate, FaChalkboardTeacher, FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa"
import { authService, type LoginCredentials } from "../services/authService"
import { useUserContext } from "../contexts/UserContext"
import { studentAuthService, type StudentLoginCredentials } from "../services/studentAuthService"

const LoginModal = ({ closeModal }: { closeModal: () => void }) => {
  console.log("🎭 LoginModal - COMPONENTE INICIANDO")

  const [role, setRole] = useState<"estudiante" | "docente" | "administrador">("administrador")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { setUser } = useUserContext()

  console.log("📊 LoginModal - Estado inicial:", {
    role,
    email: email ? email.substring(0, 3) + "***" : "",
    password: password ? "***" : "",
    showPassword,
    error,
    isLoading,
  })

  // Bloquea el scroll cuando el modal se monta
  useEffect(() => {
    console.log("🔒 LoginModal - useEffect: Bloqueando scroll")
    document.body.classList.add("overflow-hidden")
    return () => {
      console.log("🔓 LoginModal - useEffect cleanup: Desbloqueando scroll")
      document.body.classList.remove("overflow-hidden")
    }
  }, [])

  // Colores de los roles
  const getRoleColors = (role: string) => {
    console.log("🎨 LoginModal - getRoleColors INPUT:", role)

    let colors: [string, string]
    switch (role) {
      case "estudiante":
        colors = ["#9B1C2F", "#002855"]
        break
      case "docente":
        colors = ["#002855", "#B0B0B0"]
        break
      case "administrador":
        colors = ["#B0B0B0", "#9B1C2F"]
        break
      default:
        colors = ["#9B1C2F", "#002855"]
        break
    }

    console.log("🎨 LoginModal - getRoleColors OUTPUT:", colors)
    return colors
  }

  const [colorStart, colorEnd] = getRoleColors(role)
  console.log("🎨 LoginModal - Colores aplicados:", { colorStart, colorEnd })

  // Validación de los campos
  const validateFields = () => {
    console.log("✅ LoginModal - validateFields INICIANDO")
    console.log("📥 LoginModal - validateFields INPUT:", {
      email: email ? email.substring(0, 3) + "***" : "",
      password: password ? "***" : "",
      role,
    })

    if (!email || !password) {
      const errorMsg = "Todos los campos son obligatorios"
      console.log("❌ LoginModal - validateFields ERROR:", errorMsg)
      setError(errorMsg)
      return false
    }

    // Validación específica por rol
    if (role === "estudiante") {
      console.log("🎓 LoginModal - Validando estudiante...")
      // Para estudiantes, puede ser código SIS o email
      if (password.length < 6) {
        const errorMsg = "La contraseña debe tener al menos 6 caracteres"
        console.log("❌ LoginModal - validateFields ERROR (estudiante):", errorMsg)
        setError(errorMsg)
        return false
      }
    } else if (role === "docente") {
      console.log("👨‍🏫 LoginModal - Validando docente...")
      // Para docentes, debe ser email institucional
      if (!/\S+@\S+\.\S+/.test(email)) {
        const errorMsg = "Por favor ingrese un correo electrónico válido"
        console.log("❌ LoginModal - validateFields ERROR (docente):", errorMsg)
        setError(errorMsg)
        return false
      }
      if (password.length < 6) {
        const errorMsg = "La contraseña debe tener al menos 6 caracteres"
        console.log("❌ LoginModal - validateFields ERROR (docente):", errorMsg)
        setError(errorMsg)
        return false
      }
    } else if (role === "administrador") {
      console.log("👨‍💼 LoginModal - Validando administrador...")
      // Para administradores, puede ser usuario o email
      if (password.length < 6) {
        const errorMsg = "La contraseña debe tener al menos 6 caracteres"
        console.log("❌ LoginModal - validateFields ERROR (administrador):", errorMsg)
        setError(errorMsg)
        return false
      }
    }

    console.log("✅ LoginModal - validateFields EXITOSO")
    setError(null)
    return true
  }

  // Manejo del login
  const handleLogin = async () => {
    console.log("🚀 LoginModal - handleLogin INICIANDO")

    if (!validateFields()) {
      console.log("❌ LoginModal - handleLogin: Validación fallida")
      return
    }

    // Manejo específico para estudiantes
    if (role === "estudiante") {
      console.log("🎓 LoginModal - Procesando login de estudiante...")

      const studentCredentials: StudentLoginCredentials = {
        correo_estudiante: email,
        contrasenia: password,
      }

      console.log("📡 LoginModal - Llamando studentAuthService.login()...")
      const studentResponse = await studentAuthService.login(studentCredentials)
      console.log("📨 LoginModal - Respuesta del login de estudiante:", studentResponse)

      if (studentResponse && studentResponse.status === 200) {
        console.log("✅ LoginModal - LOGIN DE ESTUDIANTE EXITOSO")

        // Cerrar modal
        console.log("🚪 LoginModal - Cerrando modal...")
        closeModal()

        // Pequeña pausa para que el usuario vea el cambio
        console.log("⏱️ LoginModal - Esperando 500ms antes de redirigir...")
        setTimeout(() => {
          console.log("🌐 LoginModal - Redirigiendo al frontend de estudiante...")
          studentAuthService.redirectToStudentFrontendWithData()
        }, 500)

        return // Salir de la función para no ejecutar el código de administrador
      } else {
        console.log("❌ LoginModal - LOGIN DE ESTUDIANTE FALLIDO")
        const errorMsg = studentResponse?.message || "Error en el inicio de sesión de estudiante"
        console.log("❌ LoginModal - Mensaje de error:", errorMsg)
        setError(errorMsg)
        setIsLoading(false)
        return
      }
    }

    // Verificar conflicto de sesiones
    console.log("⚔️ LoginModal - Verificando conflicto de sesiones...")
    const hasConflict = authService.checkSessionConflict(role)
    console.log("⚔️ LoginModal - Resultado conflicto:", hasConflict)

    if (hasConflict) {
      const errorMsg = `Ya tienes una sesión activa con otro rol. Por favor, cierra sesión primero.`
      console.log("❌ LoginModal - handleLogin ERROR (conflicto):", errorMsg)
      setError(errorMsg)
      return
    }

    console.log("🔄 LoginModal - Iniciando proceso de login...")
    setIsLoading(true)
    setError(null)

    try {
      const credentials: LoginCredentials = {
        email: email,
        password: password,
        role: role,
      }
      console.log("📤 LoginModal - Credenciales preparadas:", {
        email: credentials.email ? credentials.email.substring(0, 3) + "***" : "",
        password: "***",
        role: credentials.role,
      })

      console.log("📡 LoginModal - Llamando authService.login()...")
      const response = await authService.login(credentials)
      console.log("📨 LoginModal - Respuesta del login:", response)

      if (response.success && response.data) {
        console.log("✅ LoginModal - LOGIN EXITOSO")

        // Actualizar contexto con los datos del usuario
        if (response.data.admin) {
          console.log("👤 LoginModal - Actualizando contexto de usuario...")
          setUser(response.data.admin)
          console.log("✅ LoginModal - Contexto actualizado")
        }

        // Mostrar mensaje de éxito
        console.log("🧹 LoginModal - Limpiando error...")
        setError(null)

        // Cerrar modal
        console.log("🚪 LoginModal - Cerrando modal...")
        closeModal()

        // Pequeña pausa para que el usuario vea el cambio
        console.log("⏱️ LoginModal - Esperando 500ms antes de redirigir...")
        setTimeout(() => {
          console.log("🌐 LoginModal - Redirigiendo al frontend correspondiente...")
          // Redirigir al frontend correspondiente
          authService.redirectToRoleFrontend(role)
        }, 500)
      } else {
        console.log("❌ LoginModal - LOGIN FALLIDO")
        const errorMsg = response.message || "Error en el inicio de sesión"
        console.log("❌ LoginModal - Mensaje de error:", errorMsg)
        setError(errorMsg)
      }
    } catch (error) {
      console.error("💥 LoginModal - ERROR CAPTURADO durante el login:", error)
      const errorMsg = "Error de conexión. Por favor, intenta nuevamente."
      console.log("❌ LoginModal - Estableciendo mensaje de error:", errorMsg)
      setError(errorMsg)
    } finally {
      console.log("🏁 LoginModal - Finalizando proceso de login, setIsLoading(false)")
      setIsLoading(false)
    }
  }

  // Datos de prueba para desarrollo
  const fillTestData = () => {
    console.log("🧪 LoginModal - fillTestData INICIANDO")
    console.log("🧪 LoginModal - Rol actual:", role)

    if (role === "administrador") {
      console.log("🧪 LoginModal - Llenando datos de prueba para administrador...")
      setEmail("admin@gmail.com")
      setPassword("123456")
      console.log("✅ LoginModal - Datos de prueba establecidos")
    } else {
      console.log("⚠️ LoginModal - No hay datos de prueba para el rol:", role)
    }
  }

  // Handlers para cambios de estado
  const handleRoleChange = (newRole: "estudiante" | "docente" | "administrador") => {
    console.log("🎭 LoginModal - handleRoleChange:", { from: role, to: newRole })
    setRole(newRole)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    console.log("📧 LoginModal - handleEmailChange:", newEmail ? newEmail.substring(0, 3) + "***" : "")
    setEmail(newEmail)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    console.log("🔒 LoginModal - handlePasswordChange:", newPassword ? "***" : "")
    setPassword(newPassword)
  }

  const handleShowPasswordToggle = () => {
    console.log("👁️ LoginModal - handleShowPasswordToggle:", { from: showPassword, to: !showPassword })
    setShowPassword(!showPassword)
  }

  console.log("🎭 LoginModal - RENDERIZANDO con estado:", {
    role,
    email: email ? email.substring(0, 3) + "***" : "",
    password: password ? "***" : "",
    showPassword,
    error,
    isLoading,
    colorStart,
    colorEnd,
  })

  return (
    <div className="modal-container" onClick={closeModal}>
      <div
        className={`modal-content ${role}`}
        onClick={(e) => {
          console.log("🖱️ LoginModal - Click en modal content (evitando propagación)")
          e.stopPropagation()
        }}
        style={{
          background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
        }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Campus Virtual UMSS</h2>
        <p className="text-white mb-4">Por favor, seleccione su rol:</p>

        <button
          className="text-white mb-4"
          onClick={() => {
            console.log("🔙 LoginModal - Click en volver al inicio")
            closeModal()
          }}
        >
          ← Volver al inicio
        </button>

        <div className="role-selection mb-4 flex justify-between gap-4">
          <button
            onClick={() => handleRoleChange("estudiante")}
            className={`role-button ${role === "estudiante" ? "bg-active" : ""}`}
            disabled={isLoading}
          >
            <FaUserGraduate />
            Estudiante
          </button>
          <button
            onClick={() => handleRoleChange("docente")}
            className={`role-button ${role === "docente" ? "bg-active" : ""}`}
            disabled={isLoading}
          >
            <FaChalkboardTeacher />
            Docente
          </button>
          <button
            onClick={() => handleRoleChange("administrador")}
            className={`role-button ${role === "administrador" ? "bg-active" : ""}`}
            disabled={isLoading}
          >
            <FaShieldAlt />
            Administrador
          </button>
        </div>

        {/* Formulario según el rol */}
        <div className="space-y-4">
          {role === "estudiante" && (
            <>
              <input
                type="text"
                placeholder="Código SIS o Email"
                className="input-field"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="input-field pr-12"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                  onClick={handleShowPasswordToggle}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </>
          )}
          {role === "docente" && (
            <>
              <input
                type="email"
                placeholder="Correo institucional"
                className="input-field"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="input-field pr-12"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                  onClick={handleShowPasswordToggle}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </>
          )}
          {role === "administrador" && (
            <>
              <input
                type="text"
                placeholder="Usuario o Email"
                className="input-field"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="input-field pr-12"
                  value={password}
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                  onClick={handleShowPasswordToggle}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-300 rounded-md">
            <p className="text-white text-sm">{error}</p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => {
              console.log("🚀 LoginModal - Click en botón Iniciar sesión")
              handleLogin()
            }}
            className="bg-white text-black px-4 py-2 rounded-md w-full font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md w-full font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
            onClick={() => {
              console.log("❌ LoginModal - Click en botón Cancelar")
              closeModal()
            }}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>

        {/* Enlaces adicionales */}
        <div className="mt-4 text-center space-y-2">
          <a href="#" className="forgot-password block">
            ¿Olvidaste tu contraseña?
          </a>

          {/* Botón de datos de prueba (solo en desarrollo) */}
          {process.env.NODE_ENV === "development" && role === "administrador" && (
            <button
              onClick={() => {
                console.log("🧪 LoginModal - Click en llenar datos de prueba")
                fillTestData()
              }}
              className="text-xs text-white opacity-70 hover:opacity-100 underline"
              disabled={isLoading}
            >
              Llenar datos de prueba
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginModal
