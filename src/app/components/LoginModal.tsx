'use client'

import { useEffect, useState } from 'react'
import { FaUserGraduate, FaChalkboardTeacher, FaShieldAlt } from 'react-icons/fa'
import { useRouter } from 'next/navigation' // Para la redirección
import { useUserContext } from '../contexts/UserContext' // Importamos el contexto de usuario

const LoginModal = ({ closeModal }: { closeModal: () => void }) => {
  const [role, setRole] = useState<string>('estudiante')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const { setUser } = useUserContext() // Accedemos al contexto para actualizar el estado
  const router = useRouter()

  // Bloquea el scroll cuando el modal se monta
  useEffect(() => {
    document.body.classList.add('overflow-hidden')
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  // Colores de los roles
  const getRoleColors = (role: string) => {
    switch (role) {
      case 'estudiante':
        return ['#9B1C2F', '#002855']
      case 'docente':
        return ['#002855', '#B0B0B0']
      case 'administrador':
        return ['#B0B0B0', '#9B1C2F']
      default:
        return ['#9B1C2F', '#002855']
    }
  }

  const [colorStart, colorEnd] = getRoleColors(role)

  // Validación de los campos
  const validateFields = () => {
    if (!email || !password) {
      setError('Todos los campos son obligatorios')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor ingrese un correo electrónico válido')
      return false
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return false
    }
    setError(null)
    return true
  }

  // Redirección según el rol
  const handleLogin = () => {
    if (!validateFields()) return

    // Simulación de datos del usuario después de la validación
    const userData = {
      username: email.split('@')[0], // Asignar el username con el correo (solo la parte antes de "@")
      email: email,
      role: role,
    }

    // Actualizamos el contexto con los datos del usuario
    setUser(userData)

    // Guardamos en sessionStorage
    sessionStorage.setItem('user', JSON.stringify(userData))

    // Redirigir según el rol
    if (role === 'estudiante') {
      router.push('/estudiante')
    } else if (role === 'docente') {
      router.push('/docente')
    } else if (role === 'administrador') {
      router.push('/administrador')
    }
    closeModal() // Cierra el modal después de la redirección
  }

  return (
    <div className="modal-container" onClick={closeModal}>
      <div
        className={`modal-content ${role}`}
        onClick={e => e.stopPropagation()}
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
            onClick={() => setRole('estudiante')}
            className={`role-button ${role === 'estudiante' ? 'bg-active' : ''}`}
          >
            <FaUserGraduate />
            Estudiante
          </button>
          <button
            onClick={() => setRole('docente')}
            className={`role-button ${role === 'docente' ? 'bg-active' : ''}`}
          >
            <FaChalkboardTeacher />
            Docente
          </button>
          <button
            onClick={() => setRole('administrador')}
            className={`role-button ${role === 'administrador' ? 'bg-active' : ''}`}
          >
            <FaShieldAlt />
            Administrador
          </button>
        </div>

        {/* Formulario según el rol */}
        {role === 'estudiante' && (
          <>
            <input
              type="text"
              placeholder="Código SIS"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </>
        )}
        {role === 'docente' && (
          <>
            <input
              type="email"
              placeholder="Correo institucional"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </>
        )}
        {role === 'administrador' && (
          <>
            <input
              type="text"
              placeholder="Usuario"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Botones de acción */}
        <div className="mt-6 flex gap-4">
          <button onClick={handleLogin} className="bg-white text-black px-4 py-2 rounded-md w-full">
            Iniciar sesión
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md w-full"
            onClick={closeModal}
          >
            Cancelar
          </button>
        </div>

        {/* Enlace de recuperación */}
        <div className="mt-4 text-center">
          <a href="#" className="forgot-password">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
