import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]       = useState({ name:'', email:'', password:'', phone:'', role:'PATIENT' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const data = await register(form)
      if      (data.role === 'ADMIN')  navigate('/admin/dashboard')
      else if (data.role === 'DOCTOR') navigate('/doctor/dashboard')
      else                             navigate('/patient/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Join DocBook and book appointments instantly</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input name="name" className="form-control" placeholder="John Doe"
              value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input name="email" type="email" className="form-control"
              placeholder="you@example.com" value={form.email}
              onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone number</label>
            <input name="phone" className="form-control" placeholder="9876543210"
              value={form.phone} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-control"
              placeholder="Min. 6 characters" value={form.password}
              onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Register as</label>
            <select name="role" className="form-control" value={form.role} onChange={handleChange}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
