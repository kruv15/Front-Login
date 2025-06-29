import { render, screen } from "@testing-library/react"
import '@testing-library/jest-dom'
import Footer from "../../src/app/components/Footer"

describe("Footer Component", () => {
  test("renders footer with all sections", () => {
    render(<Footer />)

    expect(screen.getByText("Soporte Técnico")).toBeInTheDocument()
    expect(screen.getByText("Enlaces Institucionales")).toBeInTheDocument()
    expect(screen.getByText("Síguenos")).toBeInTheDocument()
  })

  test("displays contact information", () => {
    render(<Footer />)

    expect(screen.getByText("Email: soporte.campus@umss.edu")).toBeInTheDocument()
    expect(screen.getByText("Teléfono: (591) 4-4525252")).toBeInTheDocument()
    expect(screen.getByText("Horario: Lunes a Viernes, 8:00 - 18:00")).toBeInTheDocument()
  })

  test("displays institutional links", () => {
    render(<Footer />)

    expect(screen.getByText("Sitio web UMSS")).toBeInTheDocument()
    expect(screen.getByText("WebSIS")).toBeInTheDocument()
    expect(screen.getByText("Reglamento Académico")).toBeInTheDocument()
  })

  test("displays copyright information", () => {
    render(<Footer />)

    expect(screen.getByText("© 2025 Universidad Mayor de San Simón")).toBeInTheDocument()
  })
})
