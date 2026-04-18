import { useState, useCallback } from 'react'
import {
  getPatientAppointmentsApi,
  getDoctorAppointmentsApi,
  getAllAppointmentsApi,
  cancelAppointmentApi,
  acceptAppointmentApi,
  completeAppointmentApi,
} from '../api/appointmentApi'
import toast from 'react-hot-toast'

export const useAppointments = (role = 'PATIENT') => {
  const [appointments, setAppointments] = useState([])
  const [loading,      setLoading]      = useState(false)

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    try {
      let res
      if (role === 'DOCTOR') res = await getDoctorAppointmentsApi()
      else if (role === 'ADMIN') res = await getAllAppointmentsApi()
      else res = await getPatientAppointmentsApi()
      setAppointments(res.data.data || [])
    } catch {
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }, [role])

  const cancel = async (id) => {
    await cancelAppointmentApi(id)
    toast.success('Appointment cancelled')
    fetchAppointments()
  }

  const accept = async (id) => {
    await acceptAppointmentApi(id)
    toast.success('Appointment accepted')
    fetchAppointments()
  }

  const complete = async (id) => {
    await completeAppointmentApi(id)
    toast.success('Appointment marked complete')
    fetchAppointments()
  }

  return { appointments, loading, fetchAppointments, cancel, accept, complete }
}
