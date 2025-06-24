"use client"

import { useEffect, useState } from "react"

export default function LogoutNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)
    const loggedOut = url.searchParams.get("logged_out")

    if (loggedOut === "true") {
      setShow(true)

      // Limpiar el parámetro de la URL sin recargar la página
      url.searchParams.delete("logged_out")
      window.history.replaceState({}, document.title, url.pathname + url.search)

      // Ocultar mensaje después de 3 segundos
      setTimeout(() => setShow(false), 3000)
    }
  }, [])

  if (!show) return null

  return (
    <div className="bg-green-100 text-green-800 py-3 px-6 text-center text-sm font-semibold shadow-md">
      ✅ Sesión cerrada correctamente.
    </div>
  )
}
