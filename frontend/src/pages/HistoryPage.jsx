import { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, Loader, Download, Globe } from 'lucide-react'
import { listJobs, downloadOutput } from '../services/api'

const STATUS_ICONS = {
    COMPLETED: <CheckCircle size={16} className="text-green-400" />,  
    FAILED: <XCircle size={16} className="text-red-400" />,  
    PENDING: <Loader size={16} className="text-yellow-400 animate-spin" />,  
}

const STATUS_COLORS = {
    COMPLETED: 'text-green-400 bg-green-400/10',
    FAILED: 'text-red-400 bg-red-400/10',
    PENDING: 'text-yellow-400 bg-yellow-400/10',
    DOWNLOADING: 'text-blue-400 bg-blue-400/10',
    TRANSCRIBING: 'text-purple-400 bg-purple-400/10',
    TRANSLATING: 'text-indigo-400 bg-indigo-400/10',
    SYNTHESIZING: 'text-pink-400 bg-pink-400/10',
    MERGING: 'text-orange-400 bg-orange-400/10',
}

const HistoryPage = () => {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        listJobs()
            .then(r => setJobs(r.data))
            .catch(() => setError('Could not load history. Is the backend running?'))
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div className="flex items-center justify-center py-32">
            <Loader size={32} className="text-indigo-400 animate-spin" />
        </div>
    )

    return (
        <main className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold gradient-text">Translation History</h1>
                    <p className="text-gray-400 mt-1">{jobs.length} job{jobs.length !== 1 ? 's' : ''} processed</p>
                </div>
            </div>

            {error && (
                <div className="glass rounded-xl p-4 text-red-400 text-sm border border-red-500/20 mb-6">{error}</div>
            )}

            {jobs.length === 0 && !error && (
                <div className="glass rounded-2xl p-16 text-center">
                    <Globe size={48} className="text-indigo-400/50 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No translations yet</p>
                    <p className="text-gray-600 text-sm mt-1">Head to the Translate tab to get started</p>
                </div>
            )}

            <div className="space-y-3">
                {jobs.map(job => (
                    <div key={job.id} className="glass rounded-2xl p-5 card-hover">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <a
                                    href={job.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-indigo-300 hover:text-indigo-200 truncate block"
                                >
                                    {job.source_url}
                                </a>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[job.status] || 'text-gray-400 bg-white/5'}`}>
                                        {STATUS_ICONS[job.status] || <Loader size={12} className="animate-spin" />}
                                        {job.status}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {job.source_language === 'auto' ? '🌐 Auto' : job.source_language.toUpperCase()} → {job.target_language.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-600">{job.media_type}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {job.status === 'COMPLETED' && (
                                    <a
                                        href={downloadOutput(job.id)}
                                        download
                                        className="flex items-center gap-1.5 bg-green-600/20 hover:bg-green-600/40 text-green-400 text-xs px-3 py-1.5 rounded-lg transition-all"
                                    >
                                        <Download size={14} /> Download
                                    </a>
                                )}
                                <span className="text-xs text-gray-600 whitespace-nowrap">
                                    <Clock size={11} className="inline mr-1" />
                                    {new Date(job.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}
