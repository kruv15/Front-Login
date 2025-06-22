"use client"

import { useEffect, useState } from "react"
import { FaUserGraduate, FaChalkboardTeacher, FaShieldAlt, FaEye, FaEyeSlash } from "react-icons/fa"
import { authService, type LoginCredentials } from "../services/authService"
import { useUserContext } from "../contexts/UserContext"

const LoginModal = ({ closeModal }: { closeModal: () => void }) => {
  const [role, setRole] = useState<"estudiante" | "docente" | "administrador">("administrador")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { setUser } = useUserContext()

  // Bloquea el scroll cuando el modal se monta
  useEffect(() => {
    document.body.classList.add("overflow-hidden")
    return () => {
      document.body.classList.remove("overflow-hidden")
    }
  }, [])

  // Colores de los roles
  const getRoleColors = (role: string) => {
    switch (role) {
      case "estudiante":
        return ["#9B1C2F", "#002855"]
      case "docente":
        return ["#002855", "#B0B0B0"]
      case "administrador":
        return ["#B0B0B0", "#9B1C2F"]
      default:
        return ["#9B1C2F", "#002855"]
    }
  }

  const [colorStart, colorEnd] = getRoleColors(role)

  // Validación de los campos
  const validateFields = () => {
    if (!email || !password) {
      setError("Todos los campos son obligatorios")
      return false
    }

    // Validación específica por rol
    if (role === "estudiante") {
      // Para estudiantes, puede ser código SIS o email
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres")
        return false
      }
    } else if (role === "docente") {
      // Para docentes, debe ser email institucional
      if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Por favor ingrese un correo electrónico válido")
        return false
      }
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres")
        return false
      }
    } else if (role === "administrador") {
      // Para administradores, puede ser usuario o email
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres")
        return false
      }
    }

    setError(null)
    return true
  }

  // Manejo del login
  const handleLogin = async () => {
    if (!validateFields()) return

    // Verificar conflicto de sesiones
    if (authService.checkSessionConflict(role)) {
      setError(`Ya tienes una sesión activa con otro rol. Por favor, cierra sesión primero.`)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const credentials: LoginCredentials = {
        email: email,
        password: password,
        role: role,
      }

      const response = await authService.login(credentials)

      if (response.success && response.data) {
        // Actualizar contexto con los datos del usuario
        if (response.data.admin) {
          setUser(response.data.admin)
        }

        // Mostrar mensaje de éxito
        setError(null)

        // Cerrar modal
        closeModal()

        // Pequeña pausa para que el usuario vea el cambio
        setTimeout(() => {
          // Redirigir al frontend correspondiente
          authService.redirectToRoleFrontend(role)
        }, 500)
      } else {
        setError(response.message || "Error en el inicio de sesión")
      }
    } catch (error) {
      console.error("Error durante el login:", error)
      setError("Error de conexión. Por favor, intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  // Datos de prueba para desarrollo
  const fillTestData = () => {
    if (role === "administrador") {
      setEmail("admin@gmail.com")
      setPassword("123456")
    }
  }

  return (
    <div className="modal-container" onClick={closeModal}>
      <div
        className={`modal-content ${role}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
        }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Campus Virtual UMSS</h2>
        <p className="text-white mb-4">Por favor, seleccione su rol:</p>

        <button className="text-white mb-4" onClick={closeModal}>
          ← Volver al inicio
        </button>

        <div className="role-selection mb-4 flex justify-between gap-4">
          <button
            onClick={() => setRole("estudiante")}
            className={`role-button ${role === "estudiante" ? "bg-active" : ""}`}
            disabled={isLoading}
          >
            <FaUserGraduate />
            Estudiante
          </button>
          <button
            onClick={() => setRole("docente")}
            className={`role-button ${role === "docente" ? "bg-active" : ""}`}
            disabled={isLoading}
          >
            <FaChalkboardTeacher />
            Docente
          </button>
          <button
            onClick={() => setRole("administrador")}
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
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="input-field pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                  onClick={() => setShowPassword(!showPassword)}
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
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="input-field pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                  onClick={() => setShowPassword(!showPassword)}
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
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  className="input-field pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
                  onClick={() => setShowPassword(!showPassword)}
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
            onClick={handleLogin}
            className="bg-white text-black px-4 py-2 rounded-md w-full font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md w-full font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
            onClick={closeModal}
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
              onClick={fillTestData}
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
