import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ─── PrivateRoute ─────────────────────────────────────────────
// A "guard" component that wraps protected pages like Dashboard.
// How it works:
//   - If the user IS logged in  → render the page normally
//   - If the user is NOT logged in → redirect them to /login
//
// Usage in App.jsx:
//   <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()

  // If no user in context/localStorage, redirect to login
  return user ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
