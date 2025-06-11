import React, { useEffect, useState } from 'react';
import { useTeam } from '../../contexts/TeamContext';
import { useParams } from 'react-router-dom';
import BarChart from '../../components/Charts/BarChart';
import LineChart from '../../components/Charts/LineChart';
import PieChart from '../../components/Charts/PieChart';
import StatCard from '../../components/Charts/StatCard';
import { FaUsers, FaTrophy, FaCheckCircle, FaChartPie } from 'react-icons/fa';

const TeamAnalytics = () => {
  const { hackathonId } = useParams();
  const { 
    getTeamsForHackathon, 
    currentTeam, 
    loading, 
    error,
    getTeamSubmissions
  } = useTeam();
  
  const [teams, setTeams] = useState([]);
  const [shortlistedTeams, setShortlistedTeams] = useState([]);
  const [registeredTeams, setRegisteredTeams] = useState([]);
  const [teamSizes, setTeamSizes] = useState([]);
  const [submissionData, setSubmissionData] = useState([]);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamsData = await getTeamsForHackathon(hackathonId);
        setTeams(teamsData);
        
        // Filter shortlisted teams
        const shortlisted = teamsData.filter(team => team.shortlisted);
        setShortlistedTeams(shortlisted);
        
        // Filter registered teams
        const registered = teamsData.filter(team => team.isRegistered);
        setRegisteredTeams(registered);
        
        // Analyze team sizes
        const sizeCounts = teamsData.reduce((acc, team) => {
          const size = team.members.length;
          acc[size] = (acc[size] || 0) + 1;
          return acc;
        }, {});
        
        const sizeData = Object.entries(sizeCounts).map(([size, count]) => ({
          name: `${size} members`,
          value: count
        }));
        setTeamSizes(sizeData);
        
        // Prepare monthly registration data
        const monthlyData = teamsData.reduce((acc, team) => {
          const date = new Date(team.createdAt);
          const month = date.toLocaleString('default', { month: 'short' });
          
          const existing = acc.find(item => item.month === month);
          if (existing) {
            existing.count++;
          } else {
            acc.push({ month, count: 1 });
          }
          return acc;
        }, []);
        
        setMonthlyRegistrations(monthlyData);
        
        // Get submission data if available
        if (currentTeam) {
          const submissions = await getTeamSubmissions(currentTeam._id, hackathonId);
          setSubmissionData(submissions);
        }
      } catch (err) {
        console.error('Error fetching team analytics:', err);
      }
    };
    
    fetchData();
  }, [hackathonId, currentTeam]);

  if (loading) return <div className="text-center py-8">Loading analytics...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Team Analytics</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Teams" 
          value={teams.length} 
          icon={<FaUsers className="text-purple-400" />} 
        />
        <StatCard 
          title="Registered Teams" 
          value={registeredTeams.length} 
          icon={<FaCheckCircle className="text-green-400" />} 
        />
        <StatCard 
          title="Shortlisted Teams" 
          value={shortlistedTeams.length} 
          icon={<FaTrophy className="text-yellow-400" />} 
        />
        <StatCard 
          title="Avg Team Size" 
          value={teams.length > 0 ? (teams.reduce((sum, team) => sum + team.members.length, 0) / teams.length)
             : 0
          } 
          icon={<FaUsers className="text-blue-400" />} 
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <BarChart 
          data={monthlyRegistrations} 
          title="Team Registrations by Month" 
          dataKey="count" 
          color="#8884d8" 
        />
        <PieChart 
          data={teamSizes} 
          title="Team Size Distribution" 
        />
      </div>
      
      {/* Additional Analytics */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 text-purple-300">Detailed Team Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Registration Status</h3>
            <p className="text-gray-300">
              {registeredTeams.length} of {teams.length} teams ({Math.round((registeredTeams.length / teams.length) * 100 || 0)}%) are registered
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Shortlisting Rate</h3>
            <p className="text-gray-300">
              {shortlistedTeams.length} of {teams.length} teams ({Math.round((shortlistedTeams.length / teams.length) * 100 || 0)}%) are shortlisted
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-2">Team Leader Stats</h3>
            <p className="text-gray-300">
              {teams.length} team leaders participating
            </p>
          </div>
        </div>
      </div>
      
      {/* Submissions Data (if available) */}
      {submissionData.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-purple-300">Team Submissions</h2>
          <LineChart 
            data={submissionData.map(sub => ({
              date: new Date(sub.submittedAt).toLocaleDateString(),
              score: sub.score || 0
            }))} 
            title="Submission Scores Over Time" 
            dataKey="score" 
            color="#82ca9d" 
          />
        </div>
      )}
    </div>
  );
};

export default TeamAnalytics;