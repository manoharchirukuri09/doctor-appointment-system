import { useState, useContext, useEffect } from 'react'
import { AppContext } from '../../context/AppContext'
import DoctorCard from '../../components/doctor/DoctorCard'
import DoctorFilter from '../../components/doctor/DoctorFilter'
import Loader from '../../components/common/Loader'
import PageHeader from '../../components/common/PageHeader'

export default function DoctorList() {
  const { doctors, loading, fetchDoctors } = useContext(AppContext)
  const [speciality, setSpeciality] = useState('')
  const [search, setSearch]         = useState('')

  useEffect(() => { fetchDoctors(speciality) }, [speciality])

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.speciality?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container fade-up" style={{ paddingTop: 36, paddingBottom: 56 }}>
      <PageHeader
        title="Find a Doctor"
        subtitle={`${filtered.length} doctor${filtered.length !== 1 ? 's' : ''} available`}
      />

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          className="form-control"
          placeholder="Search by name or speciality..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>

      {/* Speciality filter chips */}
      <DoctorFilter selected={speciality} onChange={setSpeciality} />

      {/* Grid */}
      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--gray-400)' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🩺</p>
          <p style={{ fontSize: 16 }}>No doctors found. Try a different filter.</p>
        </div>
      ) : (
        <div className="grid-4">
          {filtered.map(d => <DoctorCard key={d.id} doctor={d} />)}
        </div>
      )}
    </div>
  )
}
