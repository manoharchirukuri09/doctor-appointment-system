import axiosInstance from './axiosInstance'

export const getAllDoctorsApi    = (speciality) =>
  axiosInstance.get('/doctors', { params: speciality ? { speciality } : {} })

export const getDoctorByIdApi   = (id) =>
  axiosInstance.get(`/doctors/${id}`)

export const getDoctorDashboardApi = () =>
  axiosInstance.get('/doctors/dashboard')

export const updateDoctorProfileApi = (data) =>
  axiosInstance.put('/doctors/profile', data)
