import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '0.9rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* ── Brand ── */}
      <Link
        to={user ? '/dashboard' : '/'}
        style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: '1.2rem',
          color: 'var(--brand)',
          textDecoration: 'none',
          letterSpacing: '-0.02em',
        }}
      >
        ◈User <span style={{ color: 'var(--text)' }}>Login</span>
      </Link>

      {/* ── Nav Links ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user ? (
          <>
            <span
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Hi, <strong style={{ color: 'var(--text)' }}>{user.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                borderRadius: '8px',
                padding: '0.4rem 1rem',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.target.style.borderColor = '#ef4444'
                e.target.style.color = '#f87171'
              }}
              onMouseLeave={e => {
                e.target.style.borderColor = 'var(--border)'
                e.target.style.color = 'var(--text-muted)'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              style={{
                color: 'var(--text-muted)',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontFamily: 'DM Sans, sans-serif',
                transition: 'color 0.2s',
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                background: 'var(--brand)',
                color: '#0a0f0d',
                textDecoration: 'none',
                fontSize: '0.88rem',
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                padding: '0.4rem 1.1rem',
                borderRadius: '8px',
                transition: 'background 0.2s',
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
