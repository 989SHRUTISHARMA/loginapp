import axios from 'axios'

// ─── Base Axios Instance ──────────────────────────────────────
// Instead of writing the full URL every time (http://localhost:5000/api/...),
// we create a configured instance so all calls are relative: /api/auth/login
const API = axios.create({
  baseURL: 'https://loginapp-production-2872.up.railway.app/api',
})

// ─── Request Interceptor ──────────────────────────────────────
// This runs BEFORE every request is sent.
// If the user is logged in, it automatically attaches their JWT token
// to the Authorization header: "Bearer <token>"
// This is how the backend's `protect` middleware knows who you are.
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('mernUser')
  if (user) {
    const { token } = JSON.parse(user)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// ─── Auth API Calls ───────────────────────────────────────────

// POST /api/auth/register → { name, email, password }
export const registerAPI = (data) => API.post('/auth/register', data)

// POST /api/auth/login → { email, password }
export const loginAPI    = (data) => API.post('/auth/login', data)

// GET /api/user/dashboard → requires JWT token (handled by interceptor)
export const getDashboard = () => API.get('/user/dashboard')
