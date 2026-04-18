import axiosInstance from './axiosInstance'

export const uploadImageApi = (file, folder = 'doc-appointment') => {
  const formData = new FormData()
  formData.append('file', file)
  return axiosInstance.post(`/upload/image?folder=${folder}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
