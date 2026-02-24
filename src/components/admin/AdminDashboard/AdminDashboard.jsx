import AdminLayout from '../AdminLayout/AdminLayout';
import AdminAppointments from '../AdminAppointments/AdminAppointments';
import AdminBarbers from '../AdminBarbers/AdminBarbers';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <AdminAppointments />
        <AdminBarbers />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
