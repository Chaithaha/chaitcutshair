/**
 * Admin Dashboard Component
 * Main container for all admin sections
 */

import AdminLayout from '../AdminLayout/AdminLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <section className="admin__section">
          <div className="admin__section-header">
            <h2 className="admin__section-title">Welcome to Admin</h2>
          </div>
          <p className="admin__empty-text">More sections coming soon...</p>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
