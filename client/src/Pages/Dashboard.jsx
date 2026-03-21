import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDashboard } from '../services/authService'

// ─── Dashboard Page ───────────────────────────────────────────
// This is the PROTECTED page — only accessible when logged in.
// On mount: calls GET /api/user/dashboard (with JWT in header).
// The backend returns the user's data if the token is valid.

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()

  const [dashData, setDashData] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  // ── Fetch Dashboard Data on Mount ──────────────────────────
  // useEffect with [] runs once when the component first loads.
  // The JWT is automatically attached by our Axios interceptor.
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await getDashboard()
        setDashData(data)
      } catch (err) {
        // If token is expired or invalid, force logout
        setError('Session expired. Please log in again.')
        setTimeout(() => {
          logout()
          navigate('/login')
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  // ── Stat cards data ────────────────────────────────────────
  const stats = [
    { icon: '◈', label: 'Account Status', value: 'Active', color: '#22c55e' },
    { icon: '✦', label: 'Member Since', value: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), color: '#60a5fa' },
    { icon: '⬡', label: 'Auth Method', value: 'JWT Token', color: '#c084fc' },
    { icon: '▲', label: 'Security', value: 'bcrypt Hash', color: '#fb923c' },
  ]

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 48,
              height: 48,
              border: '3px solid var(--border)',
              borderTop: '3px solid var(--brand)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 1rem',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'DM Sans' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="auth-alert error">{error}</div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        padding: '3rem 2rem',
        maxWidth: 960,
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <div className="dot-bg" />
      <div className="glow-blob" style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Welcome Header ── */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ color: 'var(--brand)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500, marginBottom: '0.4rem' }}>
            ◈ Dashboard
          </p>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              lineHeight: 1.1,
              marginBottom: '0.5rem',
            }}
          >
            Welcome back,{' '}
            <span style={{ color: 'var(--brand)' }}>
              {dashData?.user?.name || user?.name}
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            You&apos;re successfully authenticated. Here&apos;s your account overview.
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          {stats.map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: s.color }}>{s.icon}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                {s.label}
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── User Info Card ── */}
        <div className="stat-card" style={{ marginBottom: '1rem' }}>
          <h3
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              marginBottom: '1.25rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Profile Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Full Name', value: dashData?.user?.name || user?.name },
              { label: 'Email', value: dashData?.user?.email || user?.email },
              { label: 'User ID', value: dashData?.user?._id || user?._id },
              { label: 'Role', value: 'Member' },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '0.92rem',
                    color: 'var(--text)',
                    background: 'var(--surface-2)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    wordBreak: 'break-all',
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── JWT Token Display ── */}
        <div className="stat-card">
          <h3
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              marginBottom: '0.75rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Your JWT Token
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            This token is stored in localStorage and sent with every API request.
          </p>
          <div
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#4ade80',
              wordBreak: 'break-all',
              lineHeight: 1.6,
            }}
          >
            {user?.token?.slice(0, 80)}...
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
