import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await login(form)
      if      (data.role === 'ADMIN')   navigate('/admin/dashboard')
      else if (data.role === 'DOCTOR')  navigate('/doctor/dashboard')
      else                              navigate('/patient/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your DocBook account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input name="email" type="email" className="form-control"
              placeholder="you@example.com" value={form.email}
              onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control"
              placeholder="••••••••" value={form.password}
              onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>Create one free</Link>
        </p>

        <div className={styles.demoCredentials}>
          <div className={styles.demoCredentialsTitle}>Demo Credentials</div>
          <div className={styles.demoCredentialsList}>
            <div className={styles.demoCredentialItem}>
              <span className={styles.demoLabel}>Admin:</span>
              <button 
                type="button"
                className={styles.demoValue}
                onClick={() => setForm({ email: 'admin@gmail.com', password: 'admin@523247' })}
                title="Click to autofill"
              >
                admin@gmail.com / admin@523247
              </button>
            </div>
            <div className={styles.demoCredentialItem}>
              <span className={styles.demoLabel}>Doctor:</span>
              <button 
                type="button"
                className={styles.demoValue}
                onClick={() => setForm({ email: 'doctor1@gmail.com', password: 'doctor123' })}
                title="Click to autofill"
              >
                doctor1@gmail.com / doctor123
              </button>
            </div>
            <div className={styles.demoCredentialItem}>
              <span className={styles.demoLabel}>Patient:</span>
              <button 
                type="button"
                className={styles.demoValue}
                onClick={() => setForm({ email: 'patient1@gmail.com', password: 'patient123' })}
                title="Click to autofill"
              >
                patient1@gmail.com / patient123
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

