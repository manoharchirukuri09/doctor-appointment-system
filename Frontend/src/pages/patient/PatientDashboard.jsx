import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useAppointments } from '../../hooks/useAppointments'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import PageHeader from '../../components/common/PageHeader'
import { formatDate, formatCurrency } from '../../utils/formatDate'

export default function PatientDashboard() {
  const { user } = useAuth()
  const { appointments, loading, fetchAppointments } = useAppointments('PATIENT')

  useEffect(() => { fetchAppointments() }, [])

  const pending   = appointments.filter(a => a.status === 'PENDING').length
  const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length
  const completed = appointments.filter(a => a.status === 'COMPLETED').length
  const recent    = appointments.slice(0, 5)

  return (
    <div className="container fade-up" style={{ paddingTop: 36, paddingBottom: 56 }}>
      <PageHeader
        title={`Hello, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Here's your health dashboard"
        action={<Link to="/doctors" className="btn btn-primary">Book Appointment</Link>}
      />

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Total Booked',  value: appointments.length, icon: '📅', color: '#e8f0fe' },
          { label: 'Pending',       value: pending,              icon: '⏳', color: '#fef9c3' },
          { label: 'Confirmed',     value: confirmed,            icon: '✅', color: '#dcfce7' },
          { label: 'Completed',     value: completed,            icon: '🏁', color: '#f0f7ff' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div className="stat-icon" style={{ background: s.color, fontSize: 22 }}>{s.icon}</div>
            <div>
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="card">
        <div className="card-body" style={{ paddingBottom: 0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <h2 style={{ fontSize:17, fontWeight:600 }}>Recent Appointments</h2>
            <Link to="/patient/appointments" className="btn btn-outline btn-sm">View All</Link>
          </div>
        </div>
        {loading ? <Loader /> : (
          <div className="table-wrap" style={{ borderRadius:0, border:'none', borderTop:'1px solid var(--gray-100)' }}>
            <table>
              <thead>
                <tr>
                  <th>Doctor</th><th>Speciality</th><th>Date</th><th>Time</th><th>Status</th><th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign:'center', padding:'32px', color:'var(--gray-400)' }}>
                    No appointments yet. <Link to="/doctors" style={{ color:'var(--primary)' }}>Book your first one!</Link>
                  </td></tr>
                ) : recent.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight:500 }}>{a.doctorName}</div>
                    </td>
                    <td style={{ color:'var(--gray-500)', fontSize:13 }}>{a.doctorSpeciality}</td>
                    <td>{formatDate(a.slotDate)}</td>
                    <td>{a.slotTime}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>{formatCurrency(a.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
