import { useState } from 'react'
import { createPaymentOrderApi, verifyPaymentApi } from '../../api/paymentApi'
import toast from 'react-hot-toast'

export default function RazorpayButton({ appointmentId, amount, onSuccess }) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    try {
      // Step 1: Create Razorpay order from backend
      const res = await createPaymentOrderApi({ appointmentId })
      const { orderId, razorpayKeyId, doctorName, patientName } = res.data.data

      // Step 2: Load Razorpay script dynamically
      if (!window.Razorpay) {
        await loadRazorpayScript()
      }

      // Step 3: Open Razorpay checkout
      const options = {
        key:         razorpayKeyId,
        amount:      amount * 100,        // paise
        currency:    'INR',
        name:        'DocBook',
        description: `Appointment with ${doctorName}`,
        order_id:    orderId,
        handler: async (response) => {
          try {
            // Step 4: Verify payment on backend
            await verifyPaymentApi({
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              appointmentId,
            })
            toast.success('Payment successful!')
            onSuccess?.()
          } catch {
            toast.error('Payment verification failed')
          }
        },
        prefill: { name: patientName },
        theme: { color: '#0d6efd' },
        modal: { ondismiss: () => toast('Payment cancelled', { icon: '⚠️' }) },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment init failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className="btn btn-success"
      onClick={handlePayment}
      disabled={loading}
    >
      {loading ? 'Preparing...' : `Pay ₹${amount}`}
    </button>
  )
}

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = resolve
    script.onerror = reject
    document.body.appendChild(script)
  })
}
