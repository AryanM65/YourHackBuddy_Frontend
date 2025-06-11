import React from 'react';
import { useUser } from '../contexts/UserContext';
import UserDashboard from './UserDashboard';
import AdminDashboard from './admin/AdminDashboard';
import OrganizerDashboard from './organization/OrganizerDashboard';
import { FaSpinner } from 'react-icons/fa';

const Dashboard = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <FaSpinner className="animate-spin text-4xl text-purple-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {user?.role === 'Admin' ? (
        <AdminDashboard />
      ) : user?.role === 'Organization' ? (
        <OrganizerDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
};

export default Dashboard;