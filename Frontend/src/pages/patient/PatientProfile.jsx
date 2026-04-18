import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { updateUserProfileApi } from '../../api/userApi'
import { uploadImageApi } from '../../api/uploadApi'
import PageHeader from '../../components/common/PageHeader'
import toast from 'react-hot-toast'

export default function PatientProfile() {
  const { user, updateUser } = useAuth()
  const [form, setForm]       = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [saving,    setSaving]    = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await uploadImageApi(file, 'patients')
      await updateUserProfileApi({ profileImage: res.data.data })
      updateUser({ profileImage: res.data.data })
      toast.success('Profile photo updated!')
    } catch { toast.error('Image upload failed') }
    finally { setUploading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await updateUserProfileApi(form)
      updateUser(res.data.data)
      toast.success('Profile updated!')
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="container fade-up" style={{ paddingTop:36, paddingBottom:56, maxWidth:640 }}>
      <PageHeader title="My Profile" subtitle="Manage your personal information" />
      <div className="card card-body">

        {/* Avatar */}
        <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:28, paddingBottom:24, borderBottom:'1px solid var(--gray-100)' }}>
          <div style={{ position:'relative' }}>
            {user?.profileImage
              ? <img src={user.profileImage} alt={user.name} className="avatar avatar-lg" />
              : <div style={{ width:72,height:72,borderRadius:'50%',background:'var(--primary-light)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:600,color:'var(--primary)' }}>{user?.name?.[0]}</div>
            }
          </div>
          <div>
            <p style={{ fontWeight:600, fontSize:16, marginBottom:4 }}>{user?.name}</p>
            <p style={{ fontSize:13, color:'var(--gray-500)', marginBottom:10 }}>{user?.email}</p>
            <label className="btn btn-outline btn-sm" style={{ cursor:'pointer' }}>
              {uploading ? 'Uploading...' : 'Change Photo'}
              <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input name="name" className="form-control" value={form.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-control" value={user?.email} disabled style={{ background:'var(--gray-50)', color:'var(--gray-400)' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone number</label>
            <input name="phone" className="form-control" value={form.phone} onChange={handleChange} placeholder="9876543210" />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
