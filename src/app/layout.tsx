// src/app/layout.tsx
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'

export const metadata = {
  title: 'Campus Virtual UMSS',
  description: 'Plataforma educativa oficial de la Universidad Mayor de San Simón',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
