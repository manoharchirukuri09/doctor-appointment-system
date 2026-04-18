import axiosInstance from './axiosInstance'

export const getAdminDashboardApi     = () =>
  axiosInstance.get('/admin/dashboard')

export const addDoctorApi             = (data) =>
  axiosInstance.post('/admin/doctors', data)

export const toggleDoctorApi          = (id) =>
  axiosInstance.put(`/admin/doctors/${id}/toggle`)

export const getAllDoctorsAdminApi     = () =>
  axiosInstance.get('/admin/doctors')

export const getAllPatientsAdminApi    = () =>
  axiosInstance.get('/admin/patients')
