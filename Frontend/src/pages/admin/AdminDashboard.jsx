import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAdminDashboardApi } from '../../api/adminApi'
import { getAllAppointmentsApi } from '../../api/appointmentApi'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import PageHeader from '../../components/common/PageHeader'
import { formatDate, formatCurrency } from '../../utils/formatDate'

export default function AdminDashboard() {
  const [stats,        setStats]        = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading,      setLoading]      = useState(true)

  useEffect(() => {
    Promise.all([getAdminDashboardApi(), getAllAppointmentsApi()])
      .then(([s, a]) => {
        setStats(s.data.data)
        setAppointments(a.data.data?.slice(0, 8) || [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader fullPage />

  const STATS = [
    { label:'Total Doctors',  value: stats?.totalDoctors,      icon:'🩺', color:'#dbeafe' },
    { label:'Active Doctors', value: stats?.activeDoctors,     icon:'✅', color:'#dcfce7' },
    { label:'Total Patients', value: stats?.totalPatients,     icon:'👥', color:'#e8f0fe' },
    { label:'Appointments',   value: stats?.totalAppointments, icon:'📅', color:'#fef9c3' },
    { label:'Pending',        value: stats?.pendingAppointments,   icon:'⏳', color:'#fef9c3' },
    { label:'Completed',      value: stats?.completedAppointments, icon:'🏁', color:'#dcfce7' },
    { label:'Cancelled',      value: stats?.cancelledAppointments, icon:'❌', color:'#fee2e2' },
    { label:'Total Revenue',  value: formatCurrency(stats?.totalRevenue), icon:'💰', color:'#f0fdf4' },
  ]

  return (
    <div className="container fade-up" style={{ paddingTop:36, paddingBottom:56 }}>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform overview and management"
        action={
          <div style={{ display:'flex', gap:10 }}>
            <Link to="/admin/doctors/add" className="btn btn-primary">Add Doctor</Link>
            <Link to="/admin/doctors"     className="btn btn-outline">Manage Doctors</Link>
          </div>
        }
      />

      {/* Stats grid */}
      <div className="grid-4" style={{ marginBottom:32 }}>
        {STATS.map(s => (
          <div key={s.label} className="stat-card" style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div className="stat-icon" style={{ background:s.color, fontSize:22 }}>{s.icon}</div>
            <div>
              <p className="stat-label">{s.label}</p>
              <p className="stat-value" style={{ fontSize:20 }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="card">
        <div className="card-body" style={{ paddingBottom:0 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <h2 style={{ fontSize:17, fontWeight:600 }}>Recent Appointments</h2>
            <Link to="/admin/appointments" className="btn btn-outline btn-sm">View All</Link>
          </div>
        </div>
        <div className="table-wrap" style={{ borderRadius:0, border:'none', borderTop:'1px solid var(--gray-100)' }}>
          <table>
            <thead>
              <tr><th>Patient</th><th>Doctor</th><th>Speciality</th><th>Date</th><th>Status</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:'40px', color:'var(--gray-400)' }}>No appointments yet.</td></tr>
              ) : appointments.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight:500 }}>{a.patientName}</td>
                  <td>{a.doctorName}</td>
                  <td style={{ color:'var(--gray-500)', fontSize:13 }}>{a.doctorSpeciality}</td>
                  <td>{formatDate(a.slotDate)}</td>
                  <td><StatusBadge status={a.status} /></td>
                  <td style={{ fontWeight:500 }}>{formatCurrency(a.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
