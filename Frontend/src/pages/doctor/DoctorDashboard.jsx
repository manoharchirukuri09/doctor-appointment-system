import { useState, useEffect } from 'react'
import { getDoctorDashboardApi } from '../../api/doctorApi'
import { useAppointments } from '../../hooks/useAppointments'
import { useAuth } from '../../hooks/useAuth'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import PageHeader from '../../components/common/PageHeader'
import { formatDate, formatCurrency } from '../../utils/formatDate'

export default function DoctorDashboard() {
  const { user } = useAuth()
  const { appointments, loading: apptLoading, fetchAppointments, accept, complete, cancel } = useAppointments('DOCTOR')
  const [stats,        setStats]        = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
    getDoctorDashboardApi()
      .then(r => setStats(r.data.data))
      .finally(() => setStatsLoading(false))
  }, [])

  const recent = appointments.slice(0, 6)

  return (
    <div className="container fade-up" style={{ paddingTop:36, paddingBottom:56 }}>
      <PageHeader
        title={`Dr. ${user?.name?.split(' ').slice(-1)[0]}'s Dashboard`}
        subtitle="Manage your appointments and earnings"
      />

      {/* Stats */}
      {statsLoading ? <Loader /> : stats && (
        <div className="grid-4" style={{ marginBottom:32 }}>
          {[
            { label:'Total Earnings',   value: formatCurrency(stats.totalEarnings),    icon:'💰', color:'#dcfce7' },
            { label:'Total Patients',   value: stats.totalPatients,                     icon:'👥', color:'#dbeafe' },
            { label:'Appointments',     value: stats.totalAppointments,                 icon:'📅', color:'#e8f0fe' },
            { label:'Completed',        value: stats.completedAppointments,             icon:'✅', color:'#f0fdf4' },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div className="stat-icon" style={{ background:s.color, fontSize:22 }}>{s.icon}</div>
              <div>
                <p className="stat-label">{s.label}</p>
                <p className="stat-value" style={{ fontSize:20 }}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointments table */}
      <div className="card">
        <div className="card-body" style={{ paddingBottom:0 }}>
          <h2 style={{ fontSize:17, fontWeight:600, marginBottom:16 }}>Recent Appointments</h2>
        </div>
        {apptLoading ? <Loader /> : (
          <div className="table-wrap" style={{ borderRadius:0, border:'none', borderTop:'1px solid var(--gray-100)' }}>
            <table>
              <thead>
                <tr><th>Patient</th><th>Date</th><th>Time</th><th>Status</th><th>Fee</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign:'center', padding:'40px', color:'var(--gray-400)' }}>No appointments yet.</td></tr>
                ) : recent.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight:500 }}>{a.patientName}</div>
                      <div style={{ fontSize:12, color:'var(--gray-500)' }}>{a.patientEmail}</div>
                    </td>
                    <td>{formatDate(a.slotDate)}</td>
                    <td>{a.slotTime}</td>
                    <td><StatusBadge status={a.status} /></td>
                    <td>{formatCurrency(a.amount)}</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        {a.status === 'PENDING' && (
                          <button className="btn btn-success btn-sm" onClick={() => accept(a.id)}>Accept</button>
                        )}
                        {a.status === 'CONFIRMED' && (
                          <button className="btn btn-primary btn-sm" onClick={() => complete(a.id)}>Complete</button>
                        )}
                        {['PENDING','CONFIRMED'].includes(a.status) && (
                          <button className="btn btn-danger btn-sm" onClick={() => cancel(a.id)}>Cancel</button>
                        )}
                      </div>
                    </td>
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
