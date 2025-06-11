import { useEffect } from 'react';
import { useHackathon } from '../../contexts/HackathonContext';
import { useUser } from '../../contexts/UserContext';
import BarChart from '../../components/Charts/BarChart';
import LineChart from '../../components/Charts/LineChart';
import StatCard from '../../components/Charts/StatCard';
import { FaCalendarAlt, FaMapMarkerAlt, FaTrophy, FaCheck } from 'react-icons/fa';

const AllHackathonAnalytics = () => {
  const { hackathons, loading } = useHackathon();
  const { user } = useUser();

  // Filter only approved hackathons
  const approvedHackathons = hackathons.filter(h => h.status === 'Approved');

  useEffect(() => {
    // No need to fetch analytics separately since we're using existing hackathons data
  }, [user]);

  if (user?.role !== 'Admin') {
    return (
      <div className="p-4 text-center text-red-500">
        Admin privileges required to view analytics
      </div>
    );
  }

  if (loading) return <div className="text-center py-8">Loading hackathon data...</div>;
  if (!approvedHackathons || approvedHackathons.length === 0) return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <br></br>
      <br></br>
      <br></br>
      <h1 className="text-3xl font-bold mb-8">Hackathon Analytics Dashboard</h1>
      <div className="bg-gray-800 p-6 rounded-lg text-center">
        <div className="flex justify-center mb-4">
          <FaCheck className="text-4xl text-green-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No Approved Hackathons Yet</h2>
        <p className="text-gray-400 mb-4">
          There are no approved hackathons to display analytics for. 
          Approve hackathons to see detailed analytics.
        </p>
      </div>
    </div>
  );

  // Process data for charts from approved hackathons
  const processAnalyticsData = () => {
    // Monthly growth data
    const monthlyGrowth = {};
    approvedHackathons.forEach(hackathon => {
      const month = new Date(hackathon.startDate).toLocaleString('default', { 
        month: 'short',
        year: 'numeric'
      });
      monthlyGrowth[month] = (monthlyGrowth[month] || 0) + 1;
    });

    const growthData = Object.entries(monthlyGrowth).map(([month, count]) => ({
      month,
      count
    }));

    // Top hackathons by team count
    const sizeData = [...approvedHackathons]
      .sort((a, b) => (b.teams?.length || 0) - (a.teams?.length || 0))
      .slice(0, 4)
      .map(hackathon => ({
        name: hackathon.title,
        teams: hackathon.teams?.length || 0
      }));

    // Recent hackathons (past approved hackathons)
    const pastHackathons = [...approvedHackathons]
      .filter(h => new Date(h.endDate) < new Date())
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    // Calculate stats
    const now = new Date();
    const activeHackathons = approvedHackathons.filter(h => {
      const start = new Date(h.startDate);
      const end = new Date(h.endDate);
      return start <= now && end >= now;
    }).length;

    const upcomingHackathons = approvedHackathons.filter(h => new Date(h.startDate) > now).length;

    const totalDuration = approvedHackathons.reduce((sum, h) => {
      const start = new Date(h.startDate);
      const end = new Date(h.endDate);
      return sum + (end - start) / (1000 * 60 * 60 * 24); // Convert to days
    }, 0);

    const avgDurationDays = approvedHackathons.length > 0 ? Math.round(totalDuration / approvedHackathons.length) : 0;

    // Calculate total participants across all approved hackathons
    const totalParticipants = approvedHackathons.reduce((sum, h) => 
      sum + (h.teams?.reduce((teamSum, team) => 
        teamSum + (team.members?.length || 0), 0) || 0), 0);

    return {
      growthData,
      sizeData,
      pastHackathons,
      stats: {
        totalHackathons: approvedHackathons.length,
        activeHackathons,
        avgDurationDays,
        upcomingHackathons,
        totalParticipants
      }
    };
  };

  const { growthData, sizeData, pastHackathons, stats } = processAnalyticsData();

  const calculateDurationDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <br></br>
      <br></br>
      <br></br>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Hackathon Analytics Dashboard</h1>
          <p className="text-gray-400 mt-2">Insights for approved hackathons only</p>
        </div>
        <div className="flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
          <FaCheck />
          <span>Approved Only</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard 
          title="Total Approved" 
          value={stats.totalHackathons} 
          icon="🏆"
          color="green"
        />
        <StatCard 
          title="Active Now" 
          value={stats.activeHackathons} 
          icon="🔥"
          color="red"
        />
        <StatCard 
          title="Avg Duration" 
          value={`${stats.avgDurationDays} days`} 
          icon="⏱️"
          color="blue"
        />
        <StatCard 
          title="Upcoming" 
          value={stats.upcomingHackathons} 
          icon="📅"
          color="yellow"
        />
        <StatCard 
          title="Total Participants" 
          value={stats.totalParticipants} 
          icon="👥"
          color="purple"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <LineChart 
            data={growthData} 
            title="Approved Hackathon Growth" 
            subtitle="Monthly approved hackathons"
            dataKey="count" 
            color="#10b981"
          />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <BarChart 
            data={sizeData} 
            title="Teams by Hackathon" 
            subtitle="Top 4 approved hackathons"
            dataKey="teams" 
            color="#10b981"
          />
        </div>
      </div>

      {/* Past Hackathons Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <FaTrophy className="text-yellow-500" />
            <span className="text-yellow-400">Past</span> Approved Hackathons
          </h3>
          <div className="text-sm text-gray-400">
            Showing {pastHackathons.length} events
          </div>
        </div>
        
        {pastHackathons.length > 0 ? (
          <div className="space-y-4">
            {pastHackathons.map((hackathon) => (
              <div key={hackathon._id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center hover:bg-gray-600 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{hackathon.title}</h4>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <p className="text-sm text-gray-300">
                      <FaCalendarAlt className="inline mr-1" />
                      {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-300">
                      <FaMapMarkerAlt className="inline mr-1" />
                      {hackathon.location} ({hackathon.mode})
                    </p>
                  </div>
                  {hackathon.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {hackathon.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-lg">{hackathon.teams?.length || 0} teams</p>
                  <p className="font-bold text-lg text-green-400">
                    {hackathon.teams?.reduce((sum, team) => 
                      sum + (team.members?.length || 0), 0) || 0} participants
                  </p>
                  <p className="text-sm text-gray-400">
                    Duration: {calculateDurationDays(hackathon.startDate, hackathon.endDate)} days
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No past approved hackathons
          </div>
        )}
      </div>
    </div>
  );
};

export default AllHackathonAnalytics;