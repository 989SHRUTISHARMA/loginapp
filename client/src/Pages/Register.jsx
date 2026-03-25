import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerAPI } from '../services/authService'
import { FaEye, FaEyeSlash } from 'react-icons/fa'


const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  // ── Eye Icon State ─────────────────────────────────────────
  const [showPassword, setShowPassword]               = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { name, email, password, confirmPassword } = formData

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password || !confirmPassword)
      return setError('Please fill in all fields')
    if (password !== confirmPassword)
      return setError('Passwords do not match')
    if (password.length < 6)
      return setError('Password must be at least 6 characters')

    setLoading(true)
    try {
      const { data } = await registerAPI({ name, email, password })
      login(data)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Reusable Eye Button ────────────────────────────────────
  const EyeButton = ({ show, toggle }) => (
    <button
      type="button"
      onClick={toggle}
      title={show ? 'Hide password' : 'Show password'}
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
      {show ? <FaEyeSlash /> : <FaEye />}
    </button>
  )

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem', position: 'relative',
      }}
    >
      <div className="dot-bg" />
      <div className="glow-blob" style={{ top: '-100px', right: '-100px' }} />

      <div className="auth-card" style={{ position: 'relative', zIndex: 1 }}>

        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✦</div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: '1.8rem', color: 'var(--text)', marginBottom: '0.3rem',
          }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Start your journey today
          </p>
        </div>

        {error && (
          <div className="auth-alert error" style={{ marginBottom: '1.25rem' }}>
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Name */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label className="auth-label">Full Name</label>
            <input
              className="auth-input"
              type="text" name="name" value={name}
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
              type="email" name="email" value={email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          {/* Password + Eye Icon */}
          <div style={{ marginBottom: '1.1rem' }}>
            <label className="auth-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="auth-input"
                type={showPassword ? 'text' : 'password'}
                name="password" value={password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                style={{ paddingRight: '3rem' }}
              />
              <EyeButton
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />
            </div>
          </div>

          {/* Confirm Password + Eye Icon */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="auth-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="auth-input"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword" value={confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                autoComplete="new-password"
                style={{ paddingRight: '3rem' }}
              />
              <EyeButton
                show={showConfirmPassword}
                toggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          </div>

          <button className="btn-brand" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-divider" style={{ margin: '1.5rem 0' }}>or</div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--brand)', textDecoration: 'none', fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
