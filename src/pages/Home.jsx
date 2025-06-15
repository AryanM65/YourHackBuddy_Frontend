import React from 'react';
import { useUser } from '../contexts/UserContext';
import UserHome from './UserHome';
import AdminHome from './admin/AdminHome';
import OrganizationHome from './organization/OrganizationHome';

const Home = () => {
  const { user, loading } = useUser();

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  if (!user) return <div className="text-center mt-10 text-red-500">User not logged in</div>;

  switch (user.role) {
    case 'Student':
      return <UserHome />;
    case 'Organization':
      return <OrganizationHome />;
    case 'Admin':
      return <AdminHome />;
    default:
      return <div className="text-center mt-10 text-red-500">Invalid role</div>;
  }
};

export default Home;
