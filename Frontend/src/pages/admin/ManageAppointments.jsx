import { useEffect, useState } from 'react'
import { useAppointments } from '../../hooks/useAppointments'
import StatusBadge from '../../components/common/StatusBadge'
import Loader from '../../components/common/Loader'
import PageHeader from '../../components/common/PageHeader'
import { formatDate, formatCurrency } from '../../utils/formatDate'

const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']

export default function ManageAppointments() {
  const { appointments, loading, fetchAppointments } = useAppointments('ADMIN')
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchAppointments() }, [])

  const filtered = appointments
    .filter(a => filter === 'ALL' || a.status === filter)
    .filter(a =>
      a.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName?.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="container fade-up" style={{ paddingTop:36, paddingBottom:56 }}>
      <PageHeader
        title="All Appointments"
        subtitle={`${appointments.length} total appointments on the platform`}
      />

      <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:20, alignItems:'center' }}>
        <input className="form-control" style={{ maxWidth:280 }}
          placeholder="Search patient or doctor..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <div style={{ display:'flex', gap:8 }}>
          {FILTERS.map(f => (
            <button key={f} className={`btn btn-sm ${filter===f?'btn-primary':'btn-outline'}`} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </div>

      {loading ? <Loader /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Patient</th><th>Doctor</th><th>Speciality</th><th>Date & Time</th><th>Status</th><th>Payment</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign:'center', padding:'40px', color:'var(--gray-400)' }}>No appointments found.</td></tr>
              ) : filtered.map((a, i) => (
                <tr key={a.id}>
                  <td style={{ color:'var(--gray-400)', fontSize:13 }}>{i+1}</td>
                  <td>
                    <div style={{ fontWeight:500 }}>{a.patientName}</div>
                    <div style={{ fontSize:12, color:'var(--gray-500)' }}>{a.patientEmail}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight:500 }}>{a.doctorName}</div>
                  </td>
                  <td style={{ fontSize:13, color:'var(--primary)' }}>{a.doctorSpeciality}</td>
                  <td>
                    <div>{formatDate(a.slotDate)}</div>
                    <div style={{ fontSize:12, color:'var(--gray-500)' }}>{a.slotTime}</div>
                  </td>
                  <td><StatusBadge status={a.status} /></td>
                  <td><StatusBadge status={a.paymentStatus} type="payment" /></td>
                  <td style={{ fontWeight:500 }}>{formatCurrency(a.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
