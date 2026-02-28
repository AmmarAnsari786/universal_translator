import axios from 'axios'

const API = axios.create({
    baseURL: '/api/v1',
    headers: { 'Content-Type': 'application/json' },
})

export const createJob = (payload) => API.post('/jobs', payload)
export const getJob = (jobId) => API.get(`/jobs/${jobId}`)
export const listJobs = () => API.get('/jobs')
export const getLanguages = () => API.get('/languages')
export const downloadOutput = (jobId) => `/api/v1/download/${jobId}`
