import React, { useEffect, useMemo, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useHackathon } from '../../contexts/HackathonContext';
import { BarChart, LineChart } from '../../components/Charts';
import { 
  FaTrophy, 
  FaUsers, 
  FaSpinner,
  FaUserShield,
  FaCalendarCheck,
  FaExclamationTriangle,
  FaUserFriends,
  FaPlus,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const OrganizerDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const { fetchOrgHackathons } = useHackathon();
  
  // Local state for hackathons
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'approved', 'pending', 'rejected'

  // Get organization ID safely
  const orgId = user?.organization?._id;

  useEffect(() => {
    if (!orgId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const hackathonData = await fetchOrgHackathons(orgId);
        setHackathons(hackathonData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Error loading organization data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgId]);

  // Filter hackathons based on status
  const filteredHackathons = useMemo(() => {
    if (statusFilter === 'all') return hackathons;
    return hackathons.filter(h => h.status === statusFilter);
  }, [hackathons, statusFilter]);

  // Only approved hackathons for metrics and charts
  const approvedHackathons = useMemo(() => 
    hackathons.filter(h => h.status === 'Approved'),
  [hackathons]);

  // Data processing with safe array access
  const hackathonTimelineData = useMemo(() => {
    if (!approvedHackathons.length) return [];
    
    const monthlyCounts = approvedHackathons.reduce((acc, hackathon) => {
      const date = hackathon?.startDate ? parseISO(hackathon.startDate) : new Date();
      const month = format(date, 'MMM yyyy');
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(monthlyCounts).map(([month, count]) => ({
      month,
      hackathons: count
    }));
  }, [approvedHackathons]);

  const participationData = useMemo(() => {
    if (!approvedHackathons.length) return [];
    
    return approvedHackathons.map(hackathon => ({
      name: hackathon.title || 'Untitled Hackathon',
      teams: hackathon.teams?.length || 0,
      participants: hackathon.teams?.reduce?.((sum, team) => 
        sum + (team.members?.length || 0), 0) || 0
    })).sort((a, b) => b.teams - a.teams);
  }, [approvedHackathons]);

  const activeHackathonsCount = useMemo(() => 
    approvedHackathons.filter(h => h.status === 'Approved' && 
      new Date(h.startDate) <= new Date() && 
      new Date(h.endDate) >= new Date()
    ).length,
  [approvedHackathons]);

  const completedHackathonsCount = useMemo(() => 
    approvedHackathons.filter(h => h.status === 'Approved' && 
      new Date(h.endDate) < new Date()
    ).length,
  [approvedHackathons]);

  const totalParticipants = useMemo(() => 
    approvedHackathons.reduce((sum, h) => 
      sum + (h.teams?.reduce?.((teamSum, team) => 
        teamSum + (team.members?.length || 0), 0) || 0), 0),
  [approvedHackathons]);

  const pendingHackathonsCount = useMemo(() => 
    hackathons.filter(h => h.status === 'Pending').length,
  [hackathons]);

  const rejectedHackathonsCount = useMemo(() => 
    hackathons.filter(h => h.status === 'Rejected').length,
  [hackathons]);

  // Check if there are no approved hackathons
  const noApprovedHackathons = useMemo(() => 
    !loading && approvedHackathons.length === 0, 
  [loading, approvedHackathons]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-4xl text-purple-400" />
          <span className="text-gray-400">Loading organization dashboard...</span>
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

  if (!user || !user.organization) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-400">
        <div className="flex items-center gap-2">
          <FaUserShield className="text-2xl" />
          <span>Organization access required</span>
        </div>
      </div>
    );
  }

  const MetricCard = ({ icon, title, value, color = "purple" }) => {
    const colorClasses = {
      purple: "bg-purple-500/20 text-purple-400 border-purple-500/20 hover:border-purple-400",
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
    <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-400 transition-all duration-300">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <FaTrophy className="text-purple-400" />
        {title}
      </h3>
      {children}
    </div>
  );

  const EmptyState = ({ message, action }) => (
    <div className="text-center py-12">
      <div className="text-gray-400 mb-4">{message}</div>
      {action && (
        <button
          onClick={action}
          className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2 mx-auto transition transform hover:scale-105 duration-300"
        >
          <FaPlus /> Create New Hackathon
        </button>
      )}
    </div>
  );

  const StatusFilter = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => setStatusFilter('all')}
        className={`px-3 py-1 rounded-full text-xs ${
          statusFilter === 'all' 
            ? 'bg-purple-600 text-white' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        All ({hackathons.length})
      </button>
      <button
        onClick={() => setStatusFilter('Approved')}
        className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
          statusFilter === 'Approved' 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        <FaCheckCircle /> Approved ({approvedHackathons.length})
      </button>
      <button
        onClick={() => setStatusFilter('Pending')}
        className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
          statusFilter === 'Pending' 
            ? 'bg-yellow-600 text-white' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        <FaClock /> Pending ({pendingHackathonsCount})
      </button>
      <button
        onClick={() => setStatusFilter('Rejected')}
        className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 ${
          statusFilter === 'Rejected' 
            ? 'bg-red-600 text-white' 
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        <FaTimesCircle /> Rejected ({rejectedHackathonsCount})
      </button>
    </div>
  );

  const StatusBadge = ({ status }) => {
    let bgColor, textColor, icon;
    
    switch(status) {
      case 'Approved':
        bgColor = 'bg-green-500/20';
        textColor = 'text-green-400';
        icon = <FaCheckCircle className="mr-1" />;
        break;
      case 'Pending':
        bgColor = 'bg-yellow-500/20';
        textColor = 'text-yellow-400';
        icon = <FaClock className="mr-1" />;
        break;
      case 'Rejected':
        bgColor = 'bg-red-500/20';
        textColor = 'text-red-400';
        icon = <FaTimesCircle className="mr-1" />;
        break;
      default:
        bgColor = 'bg-purple-500/20';
        textColor = 'text-purple-400';
        icon = null;
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs inline-flex items-center ${bgColor} ${textColor}`}>
        {icon} {status || 'unknown'}
      </span>
    );
  };

  const HackathonsTable = ({ hackathons }) => {
    if (hackathons.length === 0) {
      return (
        <EmptyState 
          message={`You don't have any ${statusFilter === 'all' ? '' : statusFilter.toLowerCase() + ' '}hackathons`} 
          action={() => navigate('/add-hackathon')} 
        />
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="pb-3">Hackathon</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Teams</th>
              <th className="pb-3">Participants</th>
              <th className="pb-3">Start Date</th>
            </tr>
          </thead>
          <tbody>
            {hackathons.map(hackathon => (
              <tr 
                key={hackathon._id} 
                className="border-b border-gray-800 hover:bg-gray-700/20 cursor-pointer transition-colors duration-200"
                onClick={() => navigate(`/hackathon/${hackathon._id}`)}
              >
                <td className="py-4 font-medium">{hackathon.title || 'Untitled Hackathon'}</td>
                <td className="py-4 min-w-[100px]">
                  <StatusBadge status={hackathon.status} />
                </td>
                <td className="py-4">{hackathon.teams?.length || 0}</td>
                <td className="py-4">
                  {hackathon.teams?.reduce?.((sum, team) => 
                    sum + (team.members?.length || 0), 0) || 0}
                </td>
                <td className="py-4">
                  {hackathon.startDate ? format(parseISO(hackathon.startDate), 'MMM dd, yyyy') : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <br></br>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent pb-1 leading-tight">
                Organization Dashboard
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                Welcome, {user.name}! Analytics for {user.organization.name}
              </p>
            </div>
            <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium flex items-center gap-2">
              <FaUserShield />
              {user.organization.name}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fadeIn">
          <MetricCard
            icon={<FaTrophy className="text-3xl" />}
            title="Total Hackathons"
            value={hackathons.length}
          />
          <MetricCard
            icon={<FaCheckCircle className="text-3xl" />}
            title="Approved Hackathons"
            value={approvedHackathons.length}
            color="purple"
          />
          <MetricCard
            icon={<FaClock className="text-3xl" />}
            title="Pending Approval"
            value={pendingHackathonsCount}
            color="yellow"
          />
          <MetricCard
            icon={<FaTimesCircle className="text-3xl" />}
            title="Rejected Hackathons"
            value={rejectedHackathonsCount}
            color="red"
          />
        </div>

        {/* Approved Hackathons Metrics */}
        {approvedHackathons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 animate-fadeIn">
            <MetricCard
              icon={<FaUsers className="text-3xl" />}
              title="Total Participants"
              value={totalParticipants}
            />
            <MetricCard
              icon={<FaCalendarCheck className="text-3xl" />}
              title="Active Hackathons"
              value={activeHackathonsCount}
            />
            <MetricCard
              icon={<FaUserFriends className="text-3xl" />}
              title="Completed Events"
              value={completedHackathonsCount}
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 animate-fadeIn">
          {noApprovedHackathons ? (
            <ChartContainer title="Hackathon Timeline">
              <EmptyState message="No approved hackathons for timeline data" />
            </ChartContainer>
          ) : (
            <ChartContainer title="Hackathon Timeline">
              {hackathonTimelineData.length > 0 ? (
                <div className="h-80">
                  <LineChart
                    data={hackathonTimelineData}
                    dataKey="hackathons"
                    color="#9333ea"
                    title="Approved Hackathons Over Time"
                  />
                </div>
              ) : (
                <EmptyState message="No timeline data available" />
              )}
            </ChartContainer>
          )}

          {noApprovedHackathons ? (
            <ChartContainer title="Team Participation">
              <EmptyState message="No approved hackathons for participation data" />
            </ChartContainer>
          ) : (
            <ChartContainer title="Team Participation">
              {participationData.length > 0 ? (
                <div className="h-80">
                  <BarChart
                    data={participationData}
                    dataKey="teams"
                    color="#9333ea"
                    secondaryDataKey="participants"
                    secondaryColor="#f472b6"
                    showSecondary={true}
                    title="Teams and Participants by Hackathon"
                  />
                </div>
              ) : (
                <EmptyState message="No participation data available" />
              )}
            </ChartContainer>
          )}
        </div>

        {/* Hackathons Table */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-400 transition-all duration-300 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FaTrophy className="text-purple-400" />
              Your Hackathons
            </h3>
            <div className="flex gap-4">
              <StatusFilter />
              <button
                onClick={() => navigate('/add-hackathon')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition transform hover:scale-105 duration-300 whitespace-nowrap"
              >
                <FaPlus /> Create New
              </button>
            </div>
          </div>
          <HackathonsTable hackathons={filteredHackathons} />
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Hackathon Manager. All rights reserved.</p>
      </div>
    </div>
  );
};

export default OrganizerDashboard;