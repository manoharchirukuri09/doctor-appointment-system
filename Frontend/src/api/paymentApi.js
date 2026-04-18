import axiosInstance from './axiosInstance'

export const createPaymentOrderApi = (data) =>
  axiosInstance.post('/payments/create-order', data)

export const verifyPaymentApi = (data) =>
  axiosInstance.post('/payments/verify', data)
