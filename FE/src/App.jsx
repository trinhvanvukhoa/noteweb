import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import Settings from './pages/Settings.jsx'

function App() {
  const { theme } = useApp()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <div className="layout">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/private" element={<Private />} />
      </Routes>
    </div>
  )
}

function Home() {
  return <h1>Trang chủ</h1>
}

function Private() {
  return <h1>Vùng kín</h1>
}

export default App