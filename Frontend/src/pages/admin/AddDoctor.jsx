import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoctorApi } from '../../api/adminApi'
import { uploadImageApi } from '../../api/uploadApi'
import PageHeader from '../../components/common/PageHeader'
import { SPECIALITIES } from '../../utils/constants'
import toast from 'react-hot-toast'

const INIT = {
  name:'', email:'', password:'', phone:'',
  speciality:'', degree:'', experience:'',
  about:'', address:'', consultationFee:'', profileImage:'',
}

export default function AddDoctor() {
  const navigate  = useNavigate()
  const [form, setForm]       = useState(INIT)
  const [saving,    setSaving]    = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    try {
      const res = await uploadImageApi(file, 'doctors')
      setForm(f => ({ ...f, profileImage: res.data.data }))
      toast.success('Image uploaded!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await addDoctorApi({ ...form, consultationFee: Number(form.consultationFee) })
      toast.success('Doctor added successfully!')
      navigate('/admin/doctors')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add doctor')
    } finally { setSaving(false) }
  }

  return (
    <div className="container fade-up" style={{ paddingTop:36, paddingBottom:56, maxWidth:760 }}>
      <PageHeader title="Add New Doctor" subtitle="Create a doctor account and profile" />
      <div className="card card-body">

        {/* Image upload */}
        <div style={{ marginBottom:24, paddingBottom:20, borderBottom:'1px solid var(--gray-100)' }}>
          <p className="form-label" style={{ marginBottom:10 }}>Profile Photo</p>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            {form.profileImage
              ? <img src={form.profileImage} alt="preview" className="avatar avatar-lg" style={{ borderRadius:'var(--radius-md)' }} />
              : <div style={{ width:72,height:72,borderRadius:'var(--radius-md)',background:'var(--gray-100)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,color:'var(--gray-400)' }}>🩺</div>
            }
            <label className="btn btn-outline btn-sm" style={{ cursor:'pointer' }}>
              {uploading ? 'Uploading...' : 'Upload Photo'}
              <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h3 style={{ fontSize:15, fontWeight:600, marginBottom:16, color:'var(--gray-700)' }}>Account Details</h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full name *</label>
              <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email address *</label>
              <input name="email" type="email" className="form-control" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input name="password" type="password" className="form-control" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
            </div>
          </div>

          <h3 style={{ fontSize:15, fontWeight:600, margin:'8px 0 16px', color:'var(--gray-700)' }}>Professional Details</h3>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Speciality *</label>
              <select name="speciality" className="form-control" value={form.speciality} onChange={handleChange} required>
                <option value="">Select speciality</option>
                {SPECIALITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Degree</label>
              <input name="degree" className="form-control" placeholder="MBBS, MD" value={form.degree} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Experience</label>
              <input name="experience" className="form-control" placeholder="5 years" value={form.experience} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Consultation fee (₹) *</label>
              <input name="consultationFee" type="number" className="form-control" placeholder="500" value={form.consultationFee} onChange={handleChange} required min="0" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Hospital / Address</label>
            <input name="address" className="form-control" placeholder="Apollo Hospital, Chennai" value={form.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">About</label>
            <textarea name="about" className="form-control" rows={3} placeholder="Brief professional description..." value={form.about} onChange={handleChange} style={{ resize:'vertical' }} />
          </div>

          <div style={{ display:'flex', gap:12, marginTop:8 }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Adding Doctor...' : 'Add Doctor'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/doctors')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
