import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CreatePage from './pages/CreatePage'
import JourneyPage from './pages/JourneyPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/j/:id" element={<JourneyPage />} />
    </Routes>
  )
}
