import { Link, useLocation } from 'react-router-dom'
import { Globe, History, Zap } from 'lucide-react'

const Navbar = () => {
    const location = useLocation()

    const links = [
        { to: '/', label: 'Home', icon: <Zap size={16} /> },
        { to: '/translate', label: 'Translate', icon: <Globe size={16} /> },
        { to: '/history', label: 'History', icon: <History size={16} /> },
    ]

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Globe size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-lg gradient-text">UniTranslate</span>
                </Link>

                <div className="flex items-center gap-1">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === link.to
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}
