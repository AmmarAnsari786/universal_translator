import { useState, useEffect, useRef } from 'react'
import { Link2, Globe, Film, Music, Loader, CheckCircle, XCircle, Download } from 'lucide-react'
import { createJob, getJob, getLanguages, downloadOutput } from '../services/api'

// ✅ Hardcoded languages — always visible even without backend
const FALLBACK_LANGUAGES = [
    { code: 'en', name: '🇬🇧 English' },
    { code: 'ar', name: '🇸🇦 Arabic' },
    { code: 'zh', name: '🇨🇳 Chinese (Simplified)' },
    { code: 'fr', name: '🇫🇷 French' },
    { code: 'de', name: '🇩🇪 German' },
    { code: 'hi', name: '🇮🇳 Hindi' },
    { code: 'id', name: '🇮🇩 Indonesian' },
    { code: 'it', name: '🇮🇹 Italian' },
    { code: 'ja', name: '🇯🇵 Japanese' },
    { code: 'ko', name: '🇰🇷 Korean' },
    { code: 'ms', name: '🇲🇾 Malay' },
    { code: 'nl', name: '🇳🇱 Dutch' },
    { code: 'pl', name: '🇵🇱 Polish' },
    { code: 'pt', name: '🇧🇷 Portuguese' },
    { code: 'ru', name: '🇷🇺 Russian' },
    { code: 'es', name: '🇪🇸 Spanish' },
    { code: 'sv', name: '🇸🇪 Swedish' },
    { code: 'tr', name: '🇹🇷 Turkish' },
    { code: 'uk', name: '🇺🇦 Ukrainian' },
    { code: 'ur', name: '🇵🇰 Urdu' },
]

const TranslatorPage = () => {
]

const STATUS_STEPS = ['PENDING', 'DOWNLOADING', 'TRANSCRIBING', 'TRANSLATING', 'SYNTHESIZING', 'MERGING', 'COMPLETED']

function StatusBar({ status, progress }) {
    const isError = status === 'FAILED'
    const isDone = status === 'COMPLETED'
    const idx = STATUS_STEPS.indexOf(status)
    const pct = isDone ? 100 : isError ? progress : Math.max(progress, 5)

    return (
        <div className="glass rounded-2xl p-6 mt-6">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300">
                    {isError ? '❌ Failed' : isDone ? '✅ Completed!' : `⚡ ${status}...`}
                </span>
                <span className="text-sm font-bold text-indigo-400">{pct}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                    className={`h-3 rounded-full transition-all duration-700 progress-glow ${isError ? 'bg-red-500' : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'}`}
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="flex justify-between mt-4 overflow-x-auto pb-1">
                {STATUS_STEPS.slice(0, -1).map((s, i) => (
                    <div key={s} className="flex flex-col items-center min-w-[60px]">
                        <div className={`w-2.5 h-2.5 rounded-full transition-colors ${i < idx ? 'bg-indigo-500' : i === idx ? 'bg-purple-400 animate-pulse' : 'bg-white/20'}`} />
                        <span className={`text-[9px] mt-1 ${i <= idx ? 'text-indigo-300' : 'text-gray-600'}`}>{s.slice(0, 5)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function TranslatorPage() {
    const [url, setUrl] = useState('')
    const [targetLang, setTargetLang] = useState('hi')
    const [sourceLang, setSourceLang] = useState('auto')
    const [mediaType, setMediaType] = useState('video')
    // Start with hardcoded languages immediately — merge with API results if available
    const [languages, setLanguages] = useState(FALLBACK_LANGUAGES)
    const [loading, setLoading] = useState(false)
    const [jobId, setJobId] = useState(null)
    const [jobData, setJobData] = useState(null)
    const [error, setError] = useState('')
    const intervalRef = useRef(null)

    // Try to fetch from API — if it fails, fallback languages remain
    useEffect(() => {
        getLanguages()
            .then(r => {
                if (r.data && r.data.length > 0) {
                    setLanguages(r.data.map(l => ({ code: l.code, name: l.name })))
                }
            })
            .catch(() => {
                // Keep FALLBACK_LANGUAGES — no action needed
            })
    }, [])

    useEffect(() => {
        if (!jobId) return
        intervalRef.current = setInterval(async () => {
            try {
                const { data } = await getJob(jobId)
                setJobData(data)
                if (data.status === 'COMPLETED' || data.status === 'FAILED') {
                    clearInterval(intervalRef.current)
                }
            } catch { }
        }, 2000)
        return () => clearInterval(intervalRef.current)
    }, [jobId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!url.trim()) return
        setError('')
        setJobData(null)
        setJobId(null)
        setLoading(true)
        try {
            const { data } = await createJob({ url, target_language: targetLang, source_language: sourceLang, media_type: mediaType })
            setJobId(data.id)
            setJobData(data)
        } catch (err) {
            setError(err?.response?.data?.detail || 'Failed to start job. Make sure the backend server is running.')
        } finally {
            setLoading(false)
        }
    }

    const inputCls = "w-full rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-white/10 bg-white/5"
    const selectCls = "w-full rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all border border-white/10 bg-gray-900"

    return (
        <main className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold gradient-text mb-2">Translate Media</h1>
                <p className="text-gray-400">Paste a link → choose language → get a dubbed video or audio</p>
            </div>

            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
                {/* URL Input */}
                <div>
                    <label className="text-sm text-gray-400 mb-1.5 flex items-center gap-1.5">
                        <Link2 size={14} /> Media URL
                    </label>
                    <input
                        type="url"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className={inputCls}
                        required
                    />
                </div>

                {/* Media Type */}
                <div className="flex gap-3">
                    {['video', 'audio'].map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setMediaType(t)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all border ${mediaType === t
                                ? 'bg-indigo-600 border-indigo-500 text-white'
                                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {t === 'video' ? <Film size={16} /> : <Music size={16} />}
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Language Row */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-sm text-gray-400 mb-1.5 block">Source Language</label>
                        <select
                            value={sourceLang}
                            onChange={e => setSourceLang(e.target.value)}
                            className={selectCls}
                            style={{ color: 'white', backgroundColor: '#111827' }}
                        >
                            <option value="auto" style={{ backgroundColor: '#111827', color: 'white' }}>🌐 Auto-detect</option>
                            {languages.map(l => (
                                <option key={l.code} value={l.code} style={{ backgroundColor: '#111827', color: 'white' }}>
                                    {l.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-gray-400 mb-1.5 block">Target Language</label>
                        <select
                            value={targetLang}
                            onChange={e => setTargetLang(e.target.value)}
                            className={selectCls}
                            style={{ color: 'white', backgroundColor: '#111827' }}
                        >
                            {languages.map(l => (
                                <option key={l.code} value={l.code} style={{ backgroundColor: '#111827', color: 'white' }}>
                                    {l.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Selected Languages Preview */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <span className="text-indigo-300">{languages.find(l => l.code === sourceLang)?.name || '🌐 Auto-detect'}</span>
                    <span>→</span>
                    <span className="text-purple-300">{languages.find(l => l.code === targetLang)?.name}</span>
                </div>

                {error && (
                    <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                        <XCircle size={16} />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all transform hover:scale-[1.02] glow flex items-center justify-center gap-2"
                >
                    {loading ? <Loader size={18} className="animate-spin" /> : <Globe size={18} />}
                    {loading ? 'Submitting...' : 'Start Translation'}
                </button>
            </form>

            {/* Job Status */}
            {jobData && (
                <>
                    <StatusBar status={jobData.status} progress={jobData.progress} />

                    {jobData.status === 'COMPLETED' && (
                        <div className="glass rounded-2xl p-6 mt-4 text-center">
                            <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
                            <p className="text-green-400 font-semibold mb-4">Translation Complete! 🎉</p>
                            <a
                                href={downloadOutput(jobData.id)}
                                download
                                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                <Download size={18} />
                                Download Result
                            </a>
                        </div>
                    )}

                    {jobData.status === 'FAILED' && (
                        <div className="glass rounded-2xl p-6 mt-4">
                            <p className="text-red-400 font-semibold mb-2">Translation Failed</p>
                            <pre className="text-xs text-gray-400 overflow-auto max-h-32 bg-black/30 rounded-lg p-3">
                                {jobData.error_log || 'Unknown error'}
                            </pre>
                        </div>
                    )}

                    <p className="text-center text-xs text-gray-600 mt-3">Job ID: {jobData.id}</p>
                </>
            )}
        </main>
    )
}
