import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { updateDoctorProfileApi } from '../../api/doctorApi'
import { uploadImageApi } from '../../api/uploadApi'
import PageHeader from '../../components/common/PageHeader'
import { SPECIALITIES } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function DoctorProfile() {
  const { user, updateUser } = useAuth()
  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '',
    degree: '', experience: '', about: '',
    address: '', consultationFee: '', available: true,
  })
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f => ({ ...f, [e.target.name]: val }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    setUploading(true)
    try {
      const res = await uploadImageApi(file, 'doctors')
      await updateDoctorProfileApi({ profileImage: res.data.data })
      updateUser({ profileImage: res.data.data })
      toast.success('Profile photo updated!')
    } catch { toast.error('Upload failed') }
    finally { setUploading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, consultationFee: form.consultationFee ? Number(form.consultationFee) : undefined }
      await updateDoctorProfileApi(payload)
      updateUser({ name: form.name, phone: form.phone })
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="container fade-up" style={{ paddingTop:36, paddingBottom:56, maxWidth:700 }}>
      <PageHeader title="Doctor Profile" subtitle="Update your information and availability" />
      <div className="card card-body">

        {/* Avatar */}
        <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:28, paddingBottom:24, borderBottom:'1px solid var(--gray-100)' }}>
          {user?.profileImage
            ? <img src={user.profileImage} alt={user.name} className="avatar avatar-lg" />
            : <div style={{ width:72,height:72,borderRadius:'50%',background:'var(--primary-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:600,color:'var(--primary)' }}>{user?.name?.[0]}</div>
          }
          <div>
            <p style={{ fontWeight:600, fontSize:16, marginBottom:2 }}>{user?.name}</p>
            <p style={{ fontSize:13, color:'var(--gray-500)', marginBottom:10 }}>{user?.email}</p>
            <label className="btn btn-outline btn-sm" style={{ cursor:'pointer' }}>
              {uploading ? 'Uploading...' : 'Change Photo'}
              <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input name="name" className="form-control" value={form.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
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
              <label className="form-label">Consultation fee (₹)</label>
              <input name="consultationFee" type="number" className="form-control" placeholder="500" value={form.consultationFee} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Address / Hospital</label>
              <input name="address" className="form-control" placeholder="Apollo Hospital, Chennai" value={form.address} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">About</label>
            <textarea name="about" className="form-control" rows={3} placeholder="Brief description about your practice..." value={form.about} onChange={handleChange} style={{ resize:'vertical' }} />
          </div>
          <div className="form-group" style={{ flexDirection:'row', alignItems:'center', gap:10 }}>
            <input type="checkbox" name="available" id="available" checked={form.available} onChange={handleChange} style={{ width:16, height:16, cursor:'pointer' }} />
            <label htmlFor="available" className="form-label" style={{ marginBottom:0, cursor:'pointer' }}>
              Available for appointments
            </label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
