import { useEffect, useState } from 'react'
import { useAppointments } from '../../hooks/useAppointments'
import StatusBadge from '../../components/common/StatusBadge'
import RazorpayButton from '../../components/payment/RazorpayButton'
import Loader from '../../components/common/Loader'
import PageHeader from '../../components/common/PageHeader'
import { formatDate, formatCurrency } from '../../utils/formatDate'
import toast from 'react-hot-toast'

const FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']

export default function MyAppointments() {
  const { appointments, loading, fetchAppointments, cancel } = useAppointments('PATIENT')
  const [filter, setFilter] = useState('ALL')

  useEffect(() => { fetchAppointments() }, [])

  const filtered = filter === 'ALL' ? appointments : appointments.filter(a => a.status === filter)

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return
    try { await cancel(id) } catch { toast.error('Failed to cancel') }
  }

  return (
    <div className="container fade-up" style={{ paddingTop: 36, paddingBottom: 56 }}>
      <PageHeader title="My Appointments" subtitle="Track and manage all your bookings" />

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {FILTERS.map(f => (
          <button key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(f)}
          >{f}</button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Doctor</th><th>Date & Time</th>
                <th>Status</th><th>Payment</th><th>Amount</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:'40px', color:'var(--gray-400)' }}>
                  No appointments found.
                </td></tr>
              ) : filtered.map((a, i) => (
                <tr key={a.id}>
                  <td style={{ color:'var(--gray-400)', fontSize:13 }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight:500, color:'var(--gray-900)' }}>{a.doctorName}</div>
                    <div style={{ fontSize:12, color:'var(--gray-500)' }}>{a.doctorSpeciality}</div>
                  </td>
                  <td>
                    <div>{formatDate(a.slotDate)}</div>
                    <div style={{ fontSize:12, color:'var(--gray-500)' }}>{a.slotTime}</div>
                  </td>
                  <td><StatusBadge status={a.status} /></td>
                  <td><StatusBadge status={a.paymentStatus} type="payment" /></td>
                  <td style={{ fontWeight:500 }}>{formatCurrency(a.amount)}</td>
                  <td>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {/* Pay button — show if CONFIRMED and payment pending */}
                      {a.status === 'CONFIRMED' && a.paymentStatus === 'PENDING' && (
                        <RazorpayButton
                          appointmentId={a.id}
                          amount={a.amount}
                          onSuccess={fetchAppointments}
                        />
                      )}
                      {/* Cancel button */}
                      {['PENDING','CONFIRMED'].includes(a.status) && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(a.id)}
                        >Cancel</button>
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
