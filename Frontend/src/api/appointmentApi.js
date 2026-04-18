import axiosInstance from './axiosInstance'

export const bookAppointmentApi        = (data) =>
  axiosInstance.post('/appointments/book', data)

export const getPatientAppointmentsApi = () =>
  axiosInstance.get('/appointments/patient')

export const getDoctorAppointmentsApi  = () =>
  axiosInstance.get('/appointments/doctor')

export const getAllAppointmentsApi     = () =>
  axiosInstance.get('/appointments/all')

export const cancelAppointmentApi     = (id) =>
  axiosInstance.put(`/appointments/${id}/cancel`)

export const acceptAppointmentApi     = (id) =>
  axiosInstance.put(`/appointments/${id}/accept`)

export const completeAppointmentApi   = (id) =>
  axiosInstance.put(`/appointments/${id}/complete`)
