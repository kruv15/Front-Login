'use client'

import { useState } from 'react'
import { FaUserGraduate, FaChalkboardTeacher, FaShieldAlt } from 'react-icons/fa'

const LoginModal = ({ closeModal }: { closeModal: () => void }) => {
  const [role, setRole] = useState<string>('estudiante')

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
            <input type="text" placeholder="Código SIS" className="input-field" />
            <input type="password" placeholder="Contraseña" className="input-field" />
          </>
        )}
        {role === 'docente' && (
          <>
            <input type="email" placeholder="Correo institucional" className="input-field" />
            <input type="password" placeholder="Contraseña" className="input-field" />
          </>
        )}
        {role === 'administrador' && (
          <>
            <input type="text" placeholder="Usuario" className="input-field" />
            <input type="password" placeholder="Contraseña" className="input-field" />
          </>
        )}

        {/* Botones de acción */}
        <div className="mt-6 flex gap-4">
          <button className="bg-white text-black px-4 py-2 rounded-md w-full">
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
