/**
 * Admin Layout Component
 * Wraps admin sections with navigation and authentication
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabaseClient';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return <div className="admin__loading">Loading...</div>;
  }

  if (!user) {
    // Using navigate instead of Navigate component to avoid issues
    navigate('/admin/login');
    return null;
  }

  return (
    <div className="admin">
      {/* Admin Navigation */}
      <nav className="admin__nav">
        <div className="admin__nav-container">
          <a href="/admin" className="admin__nav-logo">
            <img src="/logo.png" alt="CHAITcutsHair" />
          </a>
          <ul className="admin__nav-links">
            <li><a href="#admin-appointments">Appointments</a></li>
            <li><a href="#admin-barbers">Barbers</a></li>
          </ul>
          <button className="admin__nav-logout" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Admin Content */}
      {children}
    </div>
  );
};

export default AdminLayout;
