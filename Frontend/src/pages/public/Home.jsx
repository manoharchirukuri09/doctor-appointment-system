import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import DoctorCard from '../../components/doctor/DoctorCard'
import styles from './Home.module.css'

const FEATURES = [
  { icon: '🔍', title: 'Find Specialists', desc: 'Search doctors by speciality, experience and availability.' },
  { icon: '📅', title: 'Book Instantly',   desc: 'Pick your preferred date and time slot in seconds.' },
  { icon: '💳', title: 'Pay Securely',     desc: 'Razorpay-powered online payment for every appointment.' },
  { icon: '📋', title: 'Track History',    desc: 'View and manage all your appointments in one place.' },
]

export default function Home() {
  const { doctors } = useContext(AppContext)
  const featured = doctors.slice(0, 4)

  return (
    <div>
      {/* ── Hero ────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
            <p className={styles.heroPre}>Trusted by 10,000+ patients</p>
            <h1 className={styles.heroTitle}>
              Book Your Doctor<br />
              <span className={styles.heroAccent}>Appointment Online</span>
            </h1>
            <p className={styles.heroDesc}>
              Connect with top specialists, schedule appointments instantly,
              and manage your healthcare — all in one place.
            </p>
            <div className={styles.heroBtns}>
              <Link to="/doctors" className="btn btn-primary btn-lg">Find a Doctor</Link>
              <Link to="/register" className="btn btn-outline btn-lg">Get Started Free</Link>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroCard}>
              <div className={styles.heroStat}><span>10K+</span><p>Patients</p></div>
              <div className={styles.heroDivider} />
              <div className={styles.heroStat}><span>200+</span><p>Doctors</p></div>
              <div className={styles.heroDivider} />
              <div className={styles.heroStat}><span>15+</span><p>Specialities</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────── */}
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Why Choose DocBook?</h2>
          <div className="grid-4">
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Doctors ─────────────────────── */}
      {featured.length > 0 && (
        <section className={styles.doctorsSection}>
          <div className="container">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
              <h2 className={styles.sectionTitle} style={{ marginBottom:0 }}>Top Doctors</h2>
              <Link to="/doctors" className="btn btn-outline btn-sm">View All</Link>
            </div>
            <div className="grid-4">
              {featured.map(d => <DoctorCard key={d.id} doctor={d} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────── */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>Ready to take control of your health?</h2>
            <p className={styles.ctaDesc}>Join thousands of patients booking appointments online.</p>
            <Link to="/register" className="btn btn-primary btn-lg">Create Free Account</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
