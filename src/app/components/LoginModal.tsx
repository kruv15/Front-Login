"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { FaUserGraduate, FaChalkboardTeacher, FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa"
import { authService, type LoginCredentials } from "../services/authService"
import { useUserContext } from "../contexts/UserContext"
import { studentAuthService, type StudentLoginCredentials } from "../services/studentAuthService"
import { teacherAuthService, type TeacherLoginCredentials } from "../services/teacherAuthService"

const LoginModal = ({ closeModal }: { closeModal: () => void }) => {
  console.log("🎭 LoginModal - COMPONENTE INICIANDO")

  const [role, setRole] = useState<"estudiante" | "docente" | "administrador">("administrador")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [useLocalhost, setUseLocalhost] = useState<boolean>(false) // Nuevo estado para el switch
  const { setUser } = useUserContext()

  console.log("📊 LoginModal - Estado inicial:", {
    role,
    email: email ? email.substring(0, 3) + "***" : "",
    password: password ? "***" : "",
    showPassword,
    error,
    isLoading,
    useLocalhost,
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
      useLocalhost,
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
      // Para docentes, puede ser usuario o email
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
    console.log("🔧 LoginModal - Modo seleccionado:", useLocalhost ? "LOCALHOST" : "PRODUCTION")

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
        useLocalhost: useLocalhost, // Pasar el modo
      }
      console.log("🛠️ Correo ingresada REAL (solo para pruebas):", email)
      console.log("🛠️ Password ingresada REAL (solo para pruebas):", password)
      console.log("🔧 Modo localhost:", useLocalhost)
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

    // Manejo específico para docentes
    if (role === "docente") {
      console.log("👨‍🏫 LoginModal - Procesando login de docente...")

      const teacherCredentials: TeacherLoginCredentials = {
        user: email,
        password: password,
        useLocalhost: useLocalhost, // Pasar el modo
      }
      console.log("🛠️ Usuario ingresado REAL (solo para pruebas):", email)
      console.log("🛠️ Password ingresada REAL (solo para pruebas):", password)
      console.log("🔧 Modo localhost:", useLocalhost)
      console.log("📡 LoginModal - Llamando teacherAuthService.login()...")
      const teacherResponse = await teacherAuthService.login(teacherCredentials)
      console.log("📨 LoginModal - Respuesta del login de docente:", teacherResponse)

      if (teacherResponse && teacherResponse.status === 200) {
        console.log("✅ LoginModal - LOGIN DE DOCENTE EXITOSO")

        // Cerrar modal
        console.log("🚪 LoginModal - Cerrando modal...")
        closeModal()

        // Pequeña pausa para que el usuario vea el cambio
        console.log("⏱️ LoginModal - Esperando 500ms antes de redirigir...")
        setTimeout(() => {
          console.log("🌐 LoginModal - Redirigiendo al frontend de docente...")
          teacherAuthService.redirectToTeacherFrontendWithData()
        }, 500)

        return // Salir de la función para no ejecutar el código de administrador
      } else {
        console.log("❌ LoginModal - LOGIN DE DOCENTE FALLIDO")
        const errorMsg = teacherResponse?.message || "Error en el inicio de sesión de docente"
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
        useLocalhost: useLocalhost, // Pasar el modo
      }
      console.log("📤 LoginModal - Credenciales preparadas:", {
        email: credentials.email ? credentials.email.substring(0, 3) + "***" : "",
        password: "***",
        role: credentials.role,
        useLocalhost: credentials.useLocalhost,
      })

      console.log("🔐 Credenciales enviadas:", credentials)

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

  const handleLocalhostToggle = () => {
    console.log("🔧 LoginModal - handleLocalhostToggle:", { from: useLocalhost, to: !useLocalhost })
    setUseLocalhost(!useLocalhost)
  }

  console.log("🎭 LoginModal - RENDERIZANDO con estado:", {
    role,
    email: email ? email.substring(0, 3) + "***" : "",
    password: password ? "***" : "",
    showPassword,
    error,
    isLoading,
    useLocalhost,
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

        {/* Switch siempre visible */}
        <div className="mb-4 p-4 bg-white bg-opacity-20 rounded-lg">
          <div className="text-center mb-3">
            <p className="text-black text-sm font-medium">
              {useLocalhost ? "🔧 Redirigirá a: Localhost (Desarrollo)" : "🌐 Redirigirá a: Deploy (Producción)"}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className={`text-black text-sm ${!useLocalhost ? "font-bold" : "opacity-70"}`}>Deploy</span>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={useLocalhost}
                onChange={handleLocalhostToggle}
                className="sr-only peer"
                disabled={isLoading}
              />
              <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-500"></div>
            </label>

            <span className={`text-black text-sm ${useLocalhost ? "font-bold" : "opacity-70"}`}>Localhost</span>
          </div>

          {useLocalhost && (
            <div className="mt-3 text-xs text-black opacity-90 text-center">
              <p className="mb-1">
                🔧 <strong>Puertos locales:</strong>
              </p>
              <p>Admin: :3002 | Docente: :3001 | Estudiante: :3004</p>
              <p>Back-Admin: :4001 | Back-Estudiante: :4002 | Back-Docente: :4003</p>
            </div>
          )}
        </div>

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
                placeholder="Email"
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
                type="text"
                placeholder="Usuario"
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
                placeholder="Email"
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
        </div>
      </div>
    </div>
  )
}

export default LoginModal
