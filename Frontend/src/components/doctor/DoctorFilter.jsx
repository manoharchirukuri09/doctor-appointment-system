import { SPECIALITIES } from '../../utils/constants'
import styles from './DoctorFilter.module.css'

export default function DoctorFilter({ selected, onChange }) {
  return (
    <div className={styles.wrap}>
      <button
        className={`${styles.chip} ${!selected ? styles.active : ''}`}
        onClick={() => onChange('')}
      >
        All
      </button>
      {SPECIALITIES.map(s => (
        <button
          key={s}
          className={`${styles.chip} ${selected === s ? styles.active : ''}`}
          onClick={() => onChange(s)}
        >
          {s}
        </button>
      ))}
    </div>
  )
}
