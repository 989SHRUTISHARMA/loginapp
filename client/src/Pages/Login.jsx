import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginAPI } from '../services/authService'

// ─── Login Page ───────────────────────────────────────────────
// Collects email and password.
// On submit: calls POST /api/auth/login via Axios.
// On success: saves user+token to AuthContext, redirects to /dashboard.

const Login = () => {
  const navigate  = useNavigate()
  const { login } = useAuth()

  // ── Form State ─────────────────────────────────────────────
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const { email, password } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  // ── Handle Submit ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) return setError('Please enter email and password')

    setLoading(true)
    try {
      // Call POST /api/auth/login
      const { data } = await loginAPI({ email, password })

      // Save user+token in context & localStorage
      login(data)

      // Go to protected dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
      }}
    >
      {/* Background effects */}
      <div className="dot-bg" />
      <div className="glow-blob" style={{ bottom: '-100px', left: '-100px' }} />

      <div className="auth-card" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>◈</div>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '1.8rem',
              color: 'var(--text)',
              marginBottom: '0.3rem',
            }}
          >
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to your account
          </p>
        </div>

        {/* ── Error Alert ── */}
        {error && (
          <div className="auth-alert error" style={{ marginBottom: '1.25rem' }}>
            ⚠ {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label className="auth-label">Email Address</label>
            <input
              className="auth-input"
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="auth-label" style={{ margin: 0 }}>Password</label>
              <span style={{ fontSize: '0.78rem', color: 'var(--brand)', cursor: 'pointer' }}>
                Forgot password?
              </span>
            </div>
            <input
              className="auth-input"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <button className="btn-brand" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        {/* ── Divider ── */}
        <div className="auth-divider" style={{ margin: '1.5rem 0' }}>
          or
        </div>

        {/* ── Link to Register ── */}
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
