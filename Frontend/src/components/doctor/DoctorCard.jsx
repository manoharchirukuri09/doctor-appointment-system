import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatDate'
import styles from './DoctorCard.module.css'

export default function DoctorCard({ doctor }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        {doctor.profileImage
          ? <img src={doctor.profileImage} alt={doctor.name} className={styles.image} />
          : <div className={styles.imageFallback}>{doctor.name?.[0]}</div>
        }
        <span className={`${styles.availBadge} ${doctor.available ? styles.available : styles.unavailable}`}>
          {doctor.available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <div className={styles.body}>
        <p className={styles.speciality}>{doctor.speciality}</p>
        <h3 className={styles.name}>{doctor.name}</h3>
        <p className={styles.exp}>{doctor.experience} experience</p>
        <div className={styles.footer}>
          <div>
            <p className={styles.feeLabel}>Consultation</p>
            <p className={styles.fee}>{formatCurrency(doctor.consultationFee)}</p>
          </div>
          <Link
            to={`/doctors/${doctor.id}`}
            className="btn btn-primary btn-sm"
            style={{ pointerEvents: doctor.available ? 'auto' : 'none', opacity: doctor.available ? 1 : 0.5 }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
