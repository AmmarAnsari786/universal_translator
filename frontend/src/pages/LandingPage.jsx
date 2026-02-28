import { Link } from 'react-router-dom'
import { Globe, Mic, Languages, Download, ArrowRight, Youtube, Music, Film, Radio, Zap, Shield, Clock } from 'lucide-react'

const PLATFORMS = [
    { icon: '▶️', name: 'YouTube' },
    { icon: '🎵', name: 'TikTok' },
    { icon: '🎙️', name: 'Spotify' },
    { icon: '📺', name: 'Vimeo' },
    { icon: '☁️', name: 'SoundCloud' },
    { icon: '🎬', name: 'Twitter/X' },
    { icon: '📘', name: 'Facebook' },
    { icon: '📷', name: 'Instagram' },
]

const FEATURES = [
    {
        icon: <Zap size={24} className="text-yellow-400" />,        title: 'Lightning Fast',        desc: 'AI-powered pipeline processes content in minutes, not hours'
    },
    {
        icon: <Languages size={24} className="text-purple-400" />,        title: '20 Languages',        desc: 'From Arabic to Ukrainian — translate into any major language'
    },
    {
        icon: <Mic size={24} className="text-blue-400" />,
        title: 'Natural Voice',
        desc: 'Microsoft Edge TTS generates human-like speech in target language'
    },
    {
        icon: <Shield size={24} className="text-green-400" />,
        title: 'Offline STT',
        desc: 'Whisper AI transcribes audio locally — no cloud needed'
    },
]

export default function LandingPage() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Hero */}
            <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-indigo-300 mb-6">
                    <Zap size={14} className="text-yellow-400" />
                    AI-Powered • 20 Languages • Real-Time
                </div>
                <h1 className="text-5xl sm:text-7xl font-extrabold mb-6 leading-tight">
                    <span className="gradient-text">Universal</span>
                    <br />
                    Video Translator
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Paste any YouTube, TikTok, Spotify, or other media link.
                    Our AI will download, transcribe, translate, and re-dub it
                    in your chosen language — automatically.
                </p>
                <Link
                    to="/translate"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 glow text-lg"
                >
                    Start Translating
                    <ArrowRight size={20} />
                </Link>
            </div>

            {/* Supported Platforms */}
            <div className="glass rounded-2xl p-8 mb-16">
                <h2 className="text-center text-gray-400 text-sm font-medium uppercase tracking-widest mb-6">
                    Supported Platforms
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {PLATFORMS.map((p) => (
                        <div key={p.name} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg text-sm text-gray-300 card-hover cursor-default">
                            <span>{p.icon}</span>
                            <span>{p.name}</span>
                        </div>
                    ))}
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg text-sm text-indigo-400">
                        + Many more
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {FEATURES.map((f) => (
                    <div key={f.title} className="glass rounded-2xl p-6 card-hover">
                        <div className="mb-4">{f.icon}</div>
                        <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>

            {/* How it works */}
            <div className="glass rounded-2xl p-10">
                <h2 className="text-2xl font-bold text-center mb-10 gradient-text">How It Works</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {[
                        { n: '1', label: 'Paste Link', desc: 'Any YouTube, TikTok or audio URL' },
                        { n: '2', label: 'Pick Language', desc: 'Choose from 20 languages' },
                        { n: '3', label: 'AI Processes', desc: 'Download → Transcribe → Translate → Dub' },
                        { n: '4', label: 'Download', desc: 'Get your dubbed video/audio' },
                    ].map((step, i, arr) => (
                        <div key={step.n} className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg mx-auto mb-2">
                                    {step.n}
                                </div>
                                <p className="font-medium text-white text-sm">{step.label}</p>
                                <p className="text-gray-400 text-xs mt-1 max-w-[100px]">{step.desc}</p>
                            </div>
                            {i < arr.length - 1 && (
                                <ArrowRight size={20} className="text-indigo-500 hidden sm:block flex-shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}
