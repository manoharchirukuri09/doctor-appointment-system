import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDoctorByIdApi } from '../../api/doctorApi'
import { bookAppointmentApi } from '../../api/appointmentApi'
import SlotPicker from '../../components/appointment/SlotPicker'
import Loader from '../../components/common/Loader'
import PageHeader from '../../components/common/PageHeader'
import { formatCurrency } from '../../utils/formatDate'
import toast from 'react-hot-toast'

export default function BookAppointment() {
  const { doctorId } = useParams()
  const navigate     = useNavigate()
  const [doctor,  setDoctor]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [date,    setDate]    = useState('')
  const [time,    setTime]    = useState('')
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    getDoctorByIdApi(doctorId)
      .then(r => setDoctor(r.data.data))
      .catch(() => toast.error('Doctor not found'))
      .finally(() => setLoading(false))
  }, [doctorId])

  const handleBook = async () => {
    if (!date || !time) { toast.error('Please select date and time'); return }
    setBooking(true)
    try {
      await bookAppointmentApi({ doctorId: Number(doctorId), slotDate: date, slotTime: time })
      toast.success('Appointment booked!')
      navigate('/patient/appointments')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <Loader fullPage />

  return (
    <div className="container fade-up" style={{ paddingTop:36, paddingBottom:56, maxWidth:680 }}>
      <PageHeader title="Book Appointment" subtitle={`with ${doctor?.name}`} />
      <div className="card card-body">
        {/* Doctor summary */}
        <div style={{ display:'flex', gap:14, alignItems:'center', marginBottom:24, paddingBottom:20, borderBottom:'1px solid var(--gray-100)' }}>
          {doctor?.profileImage
            ? <img src={doctor.profileImage} alt={doctor.name} className="avatar avatar-md" />
            : <div style={{ width:44,height:44,borderRadius:'50%',background:'var(--primary-light)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:600,color:'var(--primary)',fontSize:18 }}>{doctor?.name?.[0]}</div>
          }
          <div>
            <p style={{ fontWeight:600, color:'var(--gray-900)' }}>{doctor?.name}</p>
            <p style={{ fontSize:13, color:'var(--primary)' }}>{doctor?.speciality}</p>
            <p style={{ fontSize:13, color:'var(--gray-500)' }}>Fee: {formatCurrency(doctor?.consultationFee)}</p>
          </div>
        </div>

        <SlotPicker date={date} time={time} onDateChange={setDate} onTimeChange={setTime} />

        {date && time && (
          <div style={{ background:'var(--gray-50)', borderRadius:'var(--radius-md)', padding:'14px 16px', margin:'20px 0', fontSize:14, display:'flex', flexDirection:'column', gap:6 }}>
            <p>📅 <strong>{date}</strong> at <strong>{time}</strong></p>
            <p>💳 Consultation fee: <strong>{formatCurrency(doctor?.consultationFee)}</strong></p>
            <p style={{ fontSize:12, color:'var(--gray-500)' }}>Payment is collected after appointment is confirmed by the doctor.</p>
          </div>
        )}

        <button className="btn btn-primary w-full" style={{ marginTop:8 }} onClick={handleBook} disabled={booking || !date || !time}>
          {booking ? 'Booking...' : 'Confirm Appointment'}
        </button>
      </div>
    </div>
  )
}
