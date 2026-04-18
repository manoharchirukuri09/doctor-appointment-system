import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDoctorByIdApi } from '../../api/doctorApi'
import { bookAppointmentApi } from '../../api/appointmentApi'
import { useAuth } from '../../hooks/useAuth'
import SlotPicker from '../../components/appointment/SlotPicker'
import Loader from '../../components/common/Loader'
import { formatCurrency } from '../../utils/formatDate'
import toast from 'react-hot-toast'
import styles from './DoctorDetail.module.css'

export default function DoctorDetail() {
  const { id }     = useParams()
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const [doctor,  setDoctor]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [date,    setDate]    = useState('')
  const [time,    setTime]    = useState('')
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    getDoctorByIdApi(id)
      .then(r => setDoctor(r.data.data))
      .catch(() => toast.error('Doctor not found'))
      .finally(() => setLoading(false))
  }, [id])

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'PATIENT') { toast.error('Only patients can book appointments'); return }
    if (!date) { toast.error('Please select a date'); return }
    if (!time) { toast.error('Please select a time slot'); return }

    setBooking(true)
    try {
      await bookAppointmentApi({ doctorId: doctor.id, slotDate: date, slotTime: time })
      toast.success('Appointment booked successfully!')
      navigate('/patient/appointments')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <Loader fullPage />
  if (!doctor) return <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>Doctor not found.</div>

  return (
    <div className="container fade-up" style={{ paddingTop: 36, paddingBottom: 56 }}>
      <div className={styles.layout}>

        {/* ── Doctor Info ───────────────────────── */}
        <div className={styles.info}>
          <div className="card card-body">
            <div className={styles.doctorTop}>
              {doctor.profileImage
                ? <img src={doctor.profileImage} alt={doctor.name} className={`avatar avatar-xl ${styles.avatar}`} />
                : <div className={styles.avatarFallback}>{doctor.name?.[0]}</div>
              }
              <div>
                <p className={styles.specialityBadge}>{doctor.speciality}</p>
                <h1 className={styles.name}>{doctor.name}</h1>
                <p className={styles.degree}>{doctor.degree}</p>
                <p className={styles.exp}>{doctor.experience} of experience</p>
              </div>
            </div>

            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Consultation Fee</span>
                <span className={styles.metaValue}>{formatCurrency(doctor.consultationFee)}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Location</span>
                <span className={styles.metaValue}>{doctor.address || '—'}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Status</span>
                <span className={`badge ${doctor.available ? 'badge-success' : 'badge-danger'}`}>
                  {doctor.available ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>

            {doctor.about && (
              <div className={styles.about}>
                <h3 className={styles.aboutTitle}>About</h3>
                <p className={styles.aboutText}>{doctor.about}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Booking Panel ────────────────────── */}
        <div className={styles.booking}>
          <div className="card card-body">
            <h2 className={styles.bookTitle}>Book an Appointment</h2>
            {doctor.available ? (
              <>
                <SlotPicker
                  date={date} time={time}
                  onDateChange={setDate} onTimeChange={setTime}
                />
                {date && time && (
                  <div className={styles.summary}>
                    <p>📅 <strong>{date}</strong> at <strong>{time}</strong></p>
                    <p>💳 Fee: <strong>{formatCurrency(doctor.consultationFee)}</strong></p>
                  </div>
                )}
                <button
                  className="btn btn-primary w-full"
                  style={{ marginTop: 20 }}
                  onClick={handleBook}
                  disabled={booking || !date || !time}
                >
                  {booking ? 'Booking...' : 'Confirm Appointment'}
                </button>
                {!user && (
                  <p style={{ fontSize: 13, color: 'var(--gray-500)', textAlign: 'center', marginTop: 10 }}>
                    You'll be asked to login before booking
                  </p>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--gray-400)' }}>
                <p style={{ fontSize: 32, marginBottom: 8 }}>😔</p>
                <p>This doctor is currently not accepting appointments.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
