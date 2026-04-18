import { TIME_SLOTS } from '../../utils/constants'
import { minBookingDate } from '../../utils/formatDate'
import styles from './SlotPicker.module.css'

export default function SlotPicker({ date, time, onDateChange, onTimeChange }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.section}>
        <h4 className={styles.label}>Select Date</h4>
        <input
          type="date"
          className="form-control"
          value={date}
          min={minBookingDate()}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
      {date && (
        <div className={styles.section}>
          <h4 className={styles.label}>Select Time Slot</h4>
          <div className={styles.slots}>
            {TIME_SLOTS.map(slot => (
              <button
                key={slot}
                type="button"
                className={`${styles.slot} ${time === slot ? styles.selected : ''}`}
                onClick={() => onTimeChange(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
