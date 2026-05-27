import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import CustomerRegister from './pages/CustomerRegister';
import Dashboard from './pages/Dashboard';
import ViewPatient from './pages/ViewPatient';
import UpdatePatient from './pages/UpdatePatient';
import AddMedication from './pages/AddMedication';
import ViewMedication from './pages/ViewMedication';
import MedicationScreen from './pages/MedicationScreen';
import BookAppointment from './pages/BookAppointment';
import ViewAppointments from './pages/ViewAppointments';
import ExaminationHistory from './pages/ExaminationHistory';
import AdminUsers from './pages/AdminUsers';
import Notifications from './pages/Notifications';
import AddPatient from './pages/AddPatient';
import ManagePatients from './pages/ManagePatients';

function homePath(user) {
  if (!user) return '/dang-nhap';
  return '/';
}

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/dang-nhap" replace />;
}

function StaffRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/dang-nhap" replace />;
  if (user.role === 'customer') return <Navigate to="/" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/dang-nhap" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/dang-nhap"
        element={user ? <Navigate to={homePath(user)} replace /> : <Login />}
      />
      <Route
        path="/dang-ky"
        element={user ? <Navigate to={homePath(user)} replace /> : <CustomerRegister />}
      />
      <Route path="/khach-hang" element={<Navigate to="/" replace />} />
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="ho-so" element={<ViewPatient />} />
        <Route path="lich-su-thuoc" element={<ViewMedication />} />
        <Route path="thong-bao" element={<Notifications />} />
        <Route path="dat-lich" element={<BookAppointment />} />
        <Route path="lich-kham" element={<ViewAppointments />} />
        <Route path="lich-su-kham" element={<ExaminationHistory />} />
        <Route
          path="cap-nhat-ho-so"
          element={
            <StaffRoute>
              <UpdatePatient />
            </StaffRoute>
          }
        />
        <Route
          path="them-thuoc"
          element={
            <StaffRoute>
              <AddMedication />
            </StaffRoute>
          }
        />
        <Route
          path="man-hinh-thuoc"
          element={
            <StaffRoute>
              <MedicationScreen />
            </StaffRoute>
          }
        />
        <Route
          path="quan-ly-benh-nhan"
          element={
            <StaffRoute>
              <ManagePatients />
            </StaffRoute>
          }
        />
        <Route
          path="them-benh-nhan"
          element={
            <StaffRoute>
              <AddPatient />
            </StaffRoute>
          }
        />
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to={homePath(user)} replace />} />
    </Routes>
  );
}
