import { STATUS_COLORS, PAYMENT_STATUS_COLORS } from '../../utils/constants'

export default function StatusBadge({ status, type = 'appointment' }) {
  const map = type === 'payment' ? PAYMENT_STATUS_COLORS : STATUS_COLORS
  const color = map[status] || 'gray'
  return <span className={`badge badge-${color}`}>{status}</span>
}
