import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const dashboardLink =
    user?.role === 'ADMIN'  ? '/admin/dashboard'  :
    user?.role === 'DOCTOR' ? '/doctor/dashboard' :
    user?.role === 'PATIENT'? '/patient/dashboard': '/'

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>

        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>D</div>
          <span className={styles.logoText}>DocBook</span>
        </Link>

        {/* Desktop links */}
        <div className={styles.links}>
          <Link to="/doctors" className={`${styles.link} ${location.pathname === '/doctors' ? styles.active : ''}`}>
            Find Doctors
          </Link>
          {user && (
            <Link to={dashboardLink} className={`${styles.link} ${location.pathname.includes('dashboard') ? styles.active : ''}`}>
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth area */}
        <div className={styles.auth}>
          {user ? (
            <div className={styles.userMenu}>
              <div className={styles.userInfo} onClick={() => setMenuOpen(o => !o)}>
                {user.profileImage
                  ? <img src={user.profileImage} alt={user.name} className={`avatar avatar-sm ${styles.avatar}`} />
                  : <div className={styles.avatarFallback}>{user.name?.[0]?.toUpperCase()}</div>
                }
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.chevron}>{menuOpen ? '▲' : '▼'}</span>
              </div>
              {menuOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{user.name}</p>
                    <p className={styles.dropdownRole}>{user.role}</p>
                  </div>
                  <Link to={dashboardLink} className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>Dashboard</Link>
                  {user.role === 'PATIENT' && (
                    <>
                      <Link to="/patient/appointments" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>My Appointments</Link>
                      <Link to="/patient/profile"      className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>My Profile</Link>
                    </>
                  )}
                  {user.role === 'DOCTOR' && (
                    <Link to="/doctor/profile" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>My Profile</Link>
                  )}
                  {user.role === 'ADMIN' && (
                    <>
                      <Link to="/admin/doctors" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>Manage Doctors</Link>
                      <Link to="/admin/appointments" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>Appointments</Link>
                    </>
                  )}
                  <button className={styles.dropdownLogout} onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authBtns}>
              <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  )
}
