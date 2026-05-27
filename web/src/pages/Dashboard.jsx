import { useAuth } from '../context/AuthContext';
import DoctorDashboard from '../COD1-52-web-interface';
import CustomerDashboard from '../COD1-bonus-customer-portal';

export default function Dashboard() {
  const { isCustomer } = useAuth();
  return isCustomer ? <CustomerDashboard /> : <DoctorDashboard />;
}
