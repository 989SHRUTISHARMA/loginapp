import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerAPI } from '../services/authService'

// ─── Register Page ────────────────────────────────────────────
// Collects name, email, password, confirmPassword.
// On submit: calls POST /api/auth/register via Axios.
// On success: saves user+token to context (AuthContext.login()),
//             then navigates to /dashboard.

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  // ── Form State ─────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const { name, email, password, confirmPassword } = formData

  // ── Handle Input Change ────────────────────────────────────
  // One handler for all inputs using the field's `name` attribute
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  // ── Handle Submit ──────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault() // Stop the browser from reloading

    // Client-side validation before hitting the API
    if (!name || !email || !password || !confirmPassword) {
      return setError('Please fill in all fields')
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters')
    }

    setLoading(true)
    try {
      // Call POST /api/auth/register
      const { data } = await registerAPI({ name, email, password })

      // Save user + token in context and localStorage
      login(data)

      // Redirect to dashboard on success
      navigate('/dashboard')
    } catch (err) {
      // The error message comes from our Express backend
      setError(err.response?.data?.message || 'Registration failed. Try again.')
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
      <div className="glow-blob" style={{ top: '-100px', right: '-100px' }} />

      <div className="auth-card" style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✦</div>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: '1.8rem',
              color: 'var(--text)',
              marginBottom: '0.3rem',
            }}
          >
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Start your journey today
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

          {/* Name */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label className="auth-label">Full Name</label>
            <input
              className="auth-input"
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="John Doe"
              autoComplete="name"
            />
          </div>

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
          <div style={{ marginBottom: '1.1rem' }}>
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="auth-label">Confirm Password</label>
            <input
              className="auth-input"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
          </div>

          {/* Submit */}
          <button className="btn-brand" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        {/* ── Divider ── */}
        <div className="auth-divider" style={{ margin: '1.5rem 0' }}>
          or
        </div>

        {/* ── Link to Login ── */}
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Already have an account?{' '}
          <Link
            to="/login"
            style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
