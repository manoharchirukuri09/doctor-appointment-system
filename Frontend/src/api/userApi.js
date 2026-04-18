import axiosInstance from './axiosInstance'

export const getUserProfileApi    = () =>
  axiosInstance.get('/user/profile')

export const updateUserProfileApi = (data) =>
  axiosInstance.put('/user/profile', data)
