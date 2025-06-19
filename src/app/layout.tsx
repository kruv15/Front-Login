// src/app/layout.tsx
import './globals.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { UserContextProvider } from './contexts/UserContext' // Importa correctamente el UserContextProvider

export const metadata = {
  title: 'Campus Virtual UMSS',
  description: 'Plataforma educativa oficial de la Universidad Mayor de San Simón',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans">
        <UserContextProvider>
          <Header />
          {children}
          <Footer />
        </UserContextProvider>
      </body>
    </html>
  )
}
