import { useEffect, useState } from 'react'
import { useAppointments } from '../../hooks/useAppointments'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import PageHeader from '../../components/common/PageHeader'
import { formatDate, formatCurrency } from '../../utils/formatDate'

const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']

export default function DoctorAppointments() {
  const { appointments, loading, fetchAppointments, accept, complete, cancel } = useAppointments('DOCTOR')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => { fetchAppointments() }, [])

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <div className="container fade-up" style={{ paddingTop:36, paddingBottom:56 }}>
      <PageHeader title="My Appointments" subtitle="Accept, complete or cancel patient bookings" />

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {FILTERS.map(f => (
          <button key={f} className={`btn btn-sm ${filter===f?'btn-primary':'btn-outline'}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Patient</th><th>Date & Time</th><th>Status</th><th>Payment</th><th>Fee</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:'40px', color:'var(--gray-400)' }}>No appointments found.</td></tr>
              ) : filtered.map((a, i) => (
                <tr key={a.id}>
                  <td style={{ color:'var(--gray-400)', fontSize:13 }}>{i+1}</td>
                  <td>
                    <div style={{ fontWeight:500 }}>{a.patientName}</div>
                    <div style={{ fontSize:12, color:'var(--gray-500)' }}>{a.patientPhone}</div>
                  </td>
                  <td>
                    <div>{formatDate(a.slotDate)}</div>
                    <div style={{ fontSize:12, color:'var(--gray-500)' }}>{a.slotTime}</div>
                  </td>
                  <td><StatusBadge status={a.status} /></td>
                  <td><StatusBadge status={a.paymentStatus} type="payment" /></td>
                  <td style={{ fontWeight:500 }}>{formatCurrency(a.amount)}</td>
                  <td>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
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
  )
}
