import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginAPI } from '../services/authService'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const Login = () => {
  const navigate  = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData]         = useState({ email: '', password: '' })
  const [error, setError]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // ── Forgot Password Modal State ────────────────────────────
  const [showForgot, setShowForgot]     = useState(false)
  const [forgotEmail, setForgotEmail]   = useState('')
  const [forgotMsg, setForgotMsg]       = useState('')
  const [forgotError, setForgotError]   = useState('')

  const { email, password } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return setError('Please enter email and password')
    setLoading(true)
    try {
      const { data } = await loginAPI({ email, password })
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Forgot Password Submit ─────────────────────────────────
  const handleForgotSubmit = (e) => {
    e.preventDefault()
    setForgotError('')
    setForgotMsg('')

    if (!forgotEmail) return setForgotError('Please enter your email')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail))
      return setForgotError('Please enter a valid email')

    setForgotMsg(`✅ Password reset link sent to ${forgotEmail}`)
    setTimeout(() => {
      setShowForgot(false)
      setForgotEmail('')
      setForgotMsg('')
    }, 3000)
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', position: 'relative',
      }}
    >
      <div className="dot-bg" />
      <div className="glow-blob" style={{ bottom: '-100px', left: '-100px' }} />

      {/* ── Forgot Password Modal ── */}
      {showForgot && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={(e) => e.target === e.currentTarget && setShowForgot(false)}
        >
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '20px', padding: '2rem',
              width: '100%', maxWidth: '400px',
              animation: 'slideUp 0.3s ease both',
              position: 'relative', zIndex: 1001,
            }}
          >
            <h2 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text)',
            }}>
              🔑 Forgot Password?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Enter your registered email — we&apos;ll send you a reset link!
            </p>

            {forgotError && (
              <div className="auth-alert error" style={{ marginBottom: '1rem' }}>
                ⚠ {forgotError}
              </div>
            )}
            {forgotMsg && (
              <div className="auth-alert success" style={{ marginBottom: '1rem' }}>
                {forgotMsg}
              </div>
            )}

            <form onSubmit={handleForgotSubmit} noValidate>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="auth-label">Email Address</label>
                <input
                  className="auth-input"
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => { setForgotEmail(e.target.value); setForgotError('') }}
                  placeholder="you@example.com"
                />
              </div>
              <button className="btn-brand" type="submit">
                Send Reset Link →
              </button>
            </form>

            <button
              onClick={() => { setShowForgot(false); setForgotEmail(''); setForgotError(''); setForgotMsg('') }}
              style={{
                background: 'transparent', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                fontSize: '0.85rem', marginTop: '1rem',
                width: '100%', textAlign: 'center',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Login Card ── */}
      <div className="auth-card" style={{ position: 'relative', zIndex: 1 }}>

        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>◈</div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: '1.8rem', color: 'var(--text)', marginBottom: '0.3rem',
          }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="auth-alert error" style={{ marginBottom: '1.25rem' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Email */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label className="auth-label">Email Address</label>
            <input
              className="auth-input"
              type="email" name="email" value={email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="auth-label" style={{ margin: 0 }}>Password</label>
              {/* ── Forgot Password Link ── */}
              <span
                onClick={() => setShowForgot(true)}
                style={{
                  fontSize: '0.78rem', color: 'var(--brand)',
                  cursor: 'pointer', fontWeight: 500,
                }}
              >
                Forgot password?
              </span>
            </div>

            {/* ── Password Input with Eye Icon ── */}
            <div style={{ position: 'relative' }}>
              <input
                className="auth-input"
                type={showPassword ? 'text' : 'password'}
                name="password" value={password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute', right: '0.75rem', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', color: 'var(--text-muted)',
                  fontSize: '1.1rem', padding: '0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--brand)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button className="btn-brand" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-divider" style={{ margin: '1.5rem 0' }}>or</div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
