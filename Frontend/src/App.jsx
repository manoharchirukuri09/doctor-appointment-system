import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

// Layouts & guards
import ProtectedRoute from './components/common/ProtectedRoute'
import Navbar from './components/common/Navbar'

// Public pages
import Home        from './pages/public/Home'
import Login       from './pages/public/Login'
import Register    from './pages/public/Register'
import DoctorList  from './pages/public/DoctorList'
import DoctorDetail from './pages/public/DoctorDetail'

// Patient pages
import PatientDashboard  from './pages/patient/PatientDashboard'
import BookAppointment   from './pages/patient/BookAppointment'
import MyAppointments    from './pages/patient/MyAppointments'
import PatientProfile    from './pages/patient/PatientProfile'

// Doctor pages
import DoctorDashboard    from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/DoctorAppointments'
import DoctorProfile      from './pages/doctor/DoctorProfile'

// Admin pages
import AdminDashboard     from './pages/admin/AdminDashboard'
import ManageDoctors      from './pages/admin/ManageDoctors'
import ManageAppointments from './pages/admin/ManageAppointments'
import AddDoctor          from './pages/admin/AddDoctor'

export default function App() {
  const { user } = useAuth()

  return (
    <>
      <Navbar />
      <Routes>

        {/* ── Public ───────────────────────────────── */}
        <Route path="/"           element={<Home />} />
        <Route path="/doctors"    element={<DoctorList />} />
        <Route path="/doctors/:id" element={<DoctorDetail />} />
        <Route path="/login"      element={!user ? <Login />    : <Navigate to={getDashboard(user.role)} />} />
        <Route path="/register"   element={!user ? <Register /> : <Navigate to={getDashboard(user.role)} />} />

        {/* ── Patient ──────────────────────────────── */}
        <Route element={<ProtectedRoute role="PATIENT" />}>
          <Route path="/patient/dashboard"    element={<PatientDashboard />} />
          <Route path="/patient/book/:doctorId" element={<BookAppointment />} />
          <Route path="/patient/appointments" element={<MyAppointments />} />
          <Route path="/patient/profile"      element={<PatientProfile />} />
        </Route>

        {/* ── Doctor ───────────────────────────────── */}
        <Route element={<ProtectedRoute role="DOCTOR" />}>
          <Route path="/doctor/dashboard"     element={<DoctorDashboard />} />
          <Route path="/doctor/appointments"  element={<DoctorAppointments />} />
          <Route path="/doctor/profile"       element={<DoctorProfile />} />
        </Route>

        {/* ── Admin ────────────────────────────────── */}
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path="/admin/dashboard"      element={<AdminDashboard />} />
          <Route path="/admin/doctors"        element={<ManageDoctors />} />
          <Route path="/admin/doctors/add"    element={<AddDoctor />} />
          <Route path="/admin/appointments"   element={<ManageAppointments />} />
        </Route>

        {/* ── Fallback ─────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </>
  )
}

function getDashboard(role) {
  if (role === 'ADMIN')   return '/admin/dashboard'
  if (role === 'DOCTOR')  return '/doctor/dashboard'
  return '/patient/dashboard'
}
