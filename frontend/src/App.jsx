import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import TranslatorPage from './pages/TranslatorPage'
import HistoryPage from './pages/HistoryPage'

export default function App() {
    return (
        <div className="min-h-screen bg-animated">
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/translate" element={<TranslatorPage />} />
                <Route path="/history" element={<HistoryPage />} />
            </Routes>
        </div>
    )
}
