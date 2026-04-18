import { createContext, useState, useEffect } from 'react'
import { getAllDoctorsApi } from '../api/doctorApi'

export const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [doctors,  setDoctors]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  const fetchDoctors = async (speciality = '') => {
    setLoading(true)
    setError(null)
    try {
      const res = await getAllDoctorsApi(speciality)
      setDoctors(res.data.data || [])
    } catch (err) {
      setError('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDoctors() }, [])

  return (
    <AppContext.Provider value={{ doctors, loading, error, fetchDoctors, setDoctors }}>
      {children}
    </AppContext.Provider>
  )
}
