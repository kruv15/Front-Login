"use client"

import { useState } from "react"
import { FaUserGraduate, FaChalkboardTeacher, FaUsers } from "react-icons/fa"
import LoginModal from "./components/LoginModal" // Ajusta la ruta si es diferente
import { useUserContext } from "./contexts/UserContext"
import LogoutNotice from "./components/LogoutNotice"

export default function Home() {
  console.log("🏠 Home - COMPONENTE INICIANDO")

  const [showModal, setShowModal] = useState(false)
  const { checkAndRedirectIfAuthenticated } = useUserContext()

  console.log("📊 Home - Estado inicial:", { showModal })

  const handleShowModal = () => {
    console.log("🎭 Home - handleShowModal INICIANDO")
    console.log("🔍 Home - Verificando autenticación antes de mostrar modal...")

    checkAndRedirectIfAuthenticated()

    console.log("🔄 Home - Cambiando estado del modal a true")
    setShowModal(true)
  }

  const handleCloseModal = () => {
    console.log("🚪 Home - handleCloseModal INICIANDO")
    console.log("🔄 Home - Cambiando estado del modal a false")
    setShowModal(false)
  }

  console.log("🏠 Home - RENDERIZANDO con estado:", { showModal })

  return (
    <>
      <LogoutNotice />

      <main className="min-h-screen bg-gradient-to-b from-white via-[#f9f9f9] to-[#e6e6e6] overflow-x-hidden">
        {showModal && (
          <>
            {console.log("🎭 Home - Renderizando LoginModal")}
            <LoginModal closeModal={handleCloseModal} />
          </>
        )}

        {/* Hero */}
        <section className="text-center py-20 bg-gradient-to-r from-[#C8102E] to-[#002855] text-white">
          <h1 className="text-4xl font-bold mb-4">Bienvenido al entorno virtual de aprendizaje de la UMSS</h1>
          <p className="max-w-2xl mx-auto mb-6 text-lg">
            Accede a tus materias, recursos y actividades académicas desde un solo lugar. Diseñado para mejorar tu
            experiencia educativa.
          </p>
          <button
            className="bg-white text-[#C8102E] px-6 py-3 font-semibold rounded-md hover:bg-gray-100 transition"
            onClick={() => {
              console.log("🚀 Home - Click en botón 'Ir al Campus'")
              handleShowModal()
            }}
          >
            Ir al Campus →
          </button>
        </section>

        {/* Roles */}
        <section className="py-20 bg-gradient-to-b from-[#fefefe] to-[#f2f4f8]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 text-center px-4">
            <div className="rounded-xl p-6 shadow-md hover:shadow-xl transition bg-gradient-to-b from-[#C8102E] to-[#f8d4d4] text-white">
              <div className="flex justify-center mb-4 text-4xl">
                <FaUserGraduate />
              </div>
              <h3 className="font-bold text-lg mb-2">Para Estudiantes</h3>
              <p>
                Accede a tus materias, recursos educativos, evaluaciones y calificaciones. Mantente al día con el
                calendario académico y comunícate con tus docentes.
              </p>
            </div>
            <div className="rounded-xl p-6 shadow-md hover:shadow-xl transition bg-gradient-to-b from-[#002855] to-[#dce6f7] text-white">
              <div className="flex justify-center mb-4 text-4xl">
                <FaChalkboardTeacher />
              </div>
              <h3 className="font-bold text-lg mb-2">Para Docentes</h3>
              <p>
                Gestiona tus materias, sube materiales, crea evaluaciones y califica a tus estudiantes. Mantén una
                comunicación efectiva a través del foro de la materia.
              </p>
            </div>
            <div className="rounded-xl p-6 shadow-md hover:shadow-xl transition bg-gradient-to-b from-[#001a33] to-[#d4deec] text-white">
              <div className="flex justify-center mb-4 text-4xl">
                <FaUsers />
              </div>
              <h3 className="font-bold text-lg mb-2">Para Administradores</h3>
              <p>
                Administra usuarios, materias y asignaciones. Accede a reportes y estadísticas para tomar decisiones
                informadas sobre el proceso educativo.
              </p>
            </div>
          </div>
        </section>

        {/* Sobre la plataforma */}
        <section
          id="sobre"
          className="max-w-5xl mx-auto bg-white rounded-xl px-8 py-14 shadow-lg text-center mt-32 mb-40"
        >
          <h2 className="text-2xl font-bold text-[#C8102E] mb-6">Sobre la plataforma</h2>
          <p className="text-gray-700 mb-4">
            El Campus Virtual UMSS es la plataforma educativa oficial de la Universidad Mayor de San Simón, diseñada para
            facilitar el proceso de enseñanza-aprendizaje en un entorno digital moderno y accesible.
          </p>
          <p className="text-gray-700 mb-4">
            Nuestra plataforma integra herramientas para la gestión académica, comunicación, evaluación y seguimiento del
            proceso educativo, permitiendo a estudiantes, docentes y administradores interactuar de manera eficiente.
          </p>
          <p className="text-gray-700">
            Con un diseño centrado en el usuario, el Campus Virtual UMSS busca mejorar la experiencia educativa,
            facilitando el acceso a recursos y actividades académicas desde cualquier dispositivo y en cualquier momento.
          </p>
        </section>
      </main>
    </>
  )
}
