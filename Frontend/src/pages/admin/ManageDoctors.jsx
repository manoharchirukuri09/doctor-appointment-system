import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllDoctorsAdminApi, toggleDoctorApi } from '../../api/adminApi'
import Loader from '../../components/common/Loader'
import PageHeader from '../../components/common/PageHeader'
import { formatCurrency } from '../../utils/formatDate'
import toast from 'react-hot-toast'

export default function ManageDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  const fetchDoctors = () => {
    setLoading(true)
    getAllDoctorsAdminApi()
      .then(r => setDoctors(r.data.data || []))
      .catch(() => toast.error('Failed to load doctors'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchDoctors() }, [])

  const handleToggle = async (id) => {
    try {
      await toggleDoctorApi(id)
      toast.success('Availability updated')
      fetchDoctors()
    } catch { toast.error('Failed to update') }
  }

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.speciality?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container fade-up" style={{ paddingTop:36, paddingBottom:56 }}>
      <PageHeader
        title="Manage Doctors"
        subtitle={`${doctors.length} doctors registered`}
        action={<Link to="/admin/doctors/add" className="btn btn-primary">+ Add Doctor</Link>}
      />

      <div style={{ marginBottom:20 }}>
        <input className="form-control" style={{ maxWidth:360 }}
          placeholder="Search by name or speciality..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? <Loader /> : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Doctor</th><th>Speciality</th><th>Degree</th><th>Fee</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign:'center', padding:'40px', color:'var(--gray-400)' }}>No doctors found.</td></tr>
              ) : filtered.map((d, i) => (
                <tr key={d.id}>
                  <td style={{ color:'var(--gray-400)', fontSize:13 }}>{i+1}</td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      {d.profileImage
                        ? <img src={d.profileImage} alt={d.name} className="avatar avatar-sm" />
                        : <div style={{ width:32,height:32,borderRadius:'50%',background:'var(--primary-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600,color:'var(--primary)' }}>{d.name?.[0]}</div>
                      }
                      <div>
                        <div style={{ fontWeight:500 }}>{d.name}</div>
                        <div style={{ fontSize:12, color:'var(--gray-500)' }}>{d.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color:'var(--primary)', fontSize:13, fontWeight:500 }}>{d.speciality}</td>
                  <td style={{ color:'var(--gray-600)', fontSize:13 }}>{d.degree || '—'}</td>
                  <td style={{ fontWeight:500 }}>{formatCurrency(d.consultationFee)}</td>
                  <td>
                    <span className={`badge ${d.available ? 'badge-success' : 'badge-danger'}`}>
                      {d.available ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${d.available ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => handleToggle(d.id)}
                    >
                      {d.available ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
