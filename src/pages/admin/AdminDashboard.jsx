import React, { useEffect, useMemo, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useHackathon } from '../../contexts/HackathonContext';
import { LineChart, BarChart } from '../../components/Charts';
import { 
  FaUsers, 
  FaTrophy, 
  FaChartLine,
  FaSpinner,
  FaUserShield,
  FaRegCalendar,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaBan
} from 'react-icons/fa';
import { format, parseISO, subDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, fetchAllUsers } = useUser();
  const { hackathons, loading: hackathonLoading, fetchAllHackathons } = useHackathon();
  const navigate = useNavigate();
  // Local state management
  const [localUsers, setLocalUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    
    const loadData = async () => {
      try {
        if (user?.role === 'Admin') {
          setLoading(true);
          await fetchAllHackathons();
          const users = await fetchAllUsers();
          setLocalUsers(users);
        }
      } catch (err) {
        if (!err.name === 'AbortError') {
          console.error("Fetch error:", err);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    return () => controller.abort();
  }, [user?.role]);

  // Categorize hackathons by status
  const approvedHackathons = useMemo(() => 
    hackathons.filter(h => h.status === 'Approved')
  , [hackathons]);

  const pendingHackathons = useMemo(() => 
    hackathons.filter(h => h.status === 'Pending')
  , [hackathons]);

  const suspendedHackathons = useMemo(() => 
    hackathons.filter(h => h.status === 'Suspended')
  , [hackathons]);

  // Active hackathons are approved and currently running
  const activeHackathonsCount = useMemo(() => 
    approvedHackathons.filter(h => 
      new Date(h.startDate) <= new Date() && new Date(h.endDate) >= new Date()
    ).length
  , [approvedHackathons]);

  // Data processing
  const userGrowthData = useMemo(() => {
    if (!Array.isArray(localUsers) || localUsers.length === 0) return [];
    
    try {
      const monthlyCounts = localUsers.reduce((acc, user) => {
        const date = user?.createdAt ? parseISO(user.createdAt) : new Date();
        const month = format(date, 'MMM yyyy');
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(monthlyCounts).map(([month, count]) => ({
        month,
        users: count
      }));
    } catch (error) {
      console.error("Error processing growth data:", error);
      return [];
    }
  }, [localUsers]);

  const recentSignups = useMemo(() => {
    if (!Array.isArray(localUsers)) return [];
    
    try {
      return [...localUsers]
        .sort((a, b) => {
          const dateA = a.createdAt ? parseISO(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? parseISO(b.createdAt) : new Date(0);
          return dateB - dateA;
        })
        .slice(0, 5);
    } catch (error) {
      console.error("Error processing recent signups:", error);
      return [];
    }
  }, [localUsers]);

  const newUsersLast30Days = useMemo(() => 
    localUsers.filter(u => 
      u?.createdAt && new Date(u.createdAt) > subDays(new Date(), 30)
    ).length
  , [localUsers]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-4xl text-purple-400" />
          <span className="text-gray-400">Loading admin dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-red-400 p-6 border border-red-400/30 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <FaExclamationTriangle />
            <h2 className="text-xl">Error Loading Data</h2>
          </div>
          <p className="text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-600/30 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        <div className="flex items-center gap-2">
          <FaUserShield className="text-2xl" />
          <span>Admin access required</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <br></br>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent pb-1 leading-tight">
            Admin Dashboard
          </h1>
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
            Administrator
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            icon={<FaUsers className="text-3xl" />}
            title="Total Users"
            value={localUsers.length}
            color="purple"
          />
          <MetricCard
            icon={<FaCheckCircle className="text-3xl" />}
            title="Approved Hackathons"
            value={approvedHackathons.length}
            color="green"
          />
          <MetricCard
            icon={<FaClock className="text-3xl" />}
            title="Pending Hackathons"
            value={pendingHackathons.length}
            color="yellow"
          />
          <MetricCard
            icon={<FaBan className="text-3xl" />}
            title="Suspended Hackathons"
            value={suspendedHackathons.length}
            color="red"
          />
        </div>

        {/* Second Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <MetricCard
            icon={<FaTrophy className="text-3xl" />}
            title="Active Hackathons"
            value={activeHackathonsCount}
          />
          <MetricCard
            icon={<FaExclamationTriangle className="text-3xl" />}
            title="New Users (30d)"
            value={newUsersLast30Days}
          />
          <MetricCard
            icon={<FaRegCalendar className="text-3xl" />}
            title="Total Events"
            value={hackathons.length}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartContainer title="User Growth">
            {userGrowthData.length > 0 ? (
              <LineChart
                data={userGrowthData}
                dataKey="users"
                color="#9333ea"
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                No user growth data available
              </div>
            )}
          </ChartContainer>
          
          <ChartContainer title="Monthly Signups">
            {userGrowthData.length > 0 ? (
              <BarChart
                data={userGrowthData}
                dataKey="users"
                color="#9333ea"
              />
            ) : (
              <div className="text-center py-12 text-gray-400">
                No signup data available
              </div>
            )}
          </ChartContainer>
        </div>

        {/* Recent Signups Table */}
        <TableContainer>
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FaUsers className="text-purple-400" />
            Recent Signups
          </h3>
          <RecentSignupsTable users={recentSignups} />
        </TableContainer>
      </div>
    </div>
  );
};

// Sub-components for better organization
const MetricCard = ({ icon, title, value, color = "purple" }) => {
  const colorClasses = {
    purple: "bg-purple-500/20 text-purple-400 border-purple-500/20 hover:border-purple-400",
    green: "bg-green-500/20 text-green-400 border-green-500/20 hover:border-green-400",
    yellow: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20 hover:border-yellow-400",
    red: "bg-red-500/20 text-red-400 border-red-500/20 hover:border-red-400"
  };
  
  return (
    <div className={`bg-gray-800/50 p-6 rounded-xl border ${colorClasses[color]} transition-all duration-300`}>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

const ChartContainer = ({ children, title }) => (
  <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
    {title && (
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FaChartLine className="text-purple-400" />
        {title}
      </h3>
    )}
    {children}
  </div>
);

const TableContainer = ({ children }) => (
  <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20">
    {children}
  </div>
);

const RecentSignupsTable = ({ users }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="text-left text-gray-400 border-b border-gray-700">
          <th className="pb-3">Name</th>
          <th className="pb-3">Email</th>
          <th className="pb-3">Role</th>
          <th className="pb-3">Joined</th>
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? users.map(user => (
          <tr key={user._id} className="border-b border-gray-800 hover:bg-gray-700/20">
            <td className="py-4">{user.name}</td>
            <td className="py-4">{user.email}</td>
            <td className="py-4">
              <span className={`px-2 py-1 rounded-full text-xs ${
                user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' :
                user.role === 'Organization' ? 'bg-blue-500/20 text-blue-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {user.role}
              </span>
            </td>
            <td className="py-4">
              {user?.createdAt ? format(parseISO(user.createdAt), 'MMM dd, yyyy') : 'N/A'}
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan="4" className="py-4 text-center text-gray-400">
              No recent signups
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default AdminDashboard;