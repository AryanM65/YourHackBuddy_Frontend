import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaUsers, 
  FaUserShield, 
  FaClipboardCheck, 
  FaSpinner,
  FaArrowLeft,
  FaExclamationTriangle,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';

const ViewTeamPage = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/team/${teamId}`
        );
        console.log("response", response);
        if (response.status >= 200 && response.status < 300) {
          setTeam(response.data.team);
          setError(null);
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      } catch (err) {
        let errorMessage = 'Failed to load team details';
        
        if (err.response) {
          errorMessage = err.response.data?.message || 
                        `Server error: ${err.response.status}`;
        } else if (err.request) {
          errorMessage = 'No response from server';
        } else {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        console.error('Team fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-500 rounded-full animate-spin animation-delay-75"></div>
          </div>
          <p className="mt-4 text-gray-400">Loading team details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
        <div className="text-center max-w-lg p-8 bg-gray-800 rounded-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 mb-4">
            <FaExclamationTriangle className="text-red-400 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Team Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition"
            >
              Go Back
            </button>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            Team ID: {teamId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
        >
          <FaArrowLeft className="mt-0.5" />
          <span>Back</span>
        </button>
        
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
            <FaUsers className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Team Details
            </h1>
            <p className="text-gray-400 mt-1">Viewing details for {team.name}</p>
          </div>
        </div>

        {team?.suspended && (
          <div className="mb-8 p-4 bg-red-900/40 border border-red-500/30 rounded-xl flex items-start gap-4 backdrop-blur-sm">
            <div className="mt-1">
              <FaExclamationCircle className="text-red-300 text-xl" />
            </div>
            <div>
              <h3 className="text-red-300 font-semibold text-lg">Team Suspended</h3>
              <p className="text-red-200 mt-2">
                This team has been suspended due to violation of rules
              </p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Team Header Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-purple-400">{team.name}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    team.isRegistered ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {team.isRegistered ? 'Registered' : 'Unregistered'}
                  </span>
                  <span className="px-4 py-2 bg-blue-900/30 text-blue-400 rounded-full text-sm">
                    {team.members.length} Member{team.members.length !== 1 ? 's' : ''}
                  </span>
                  {team.hackathon?.name && (
                    <span className="px-4 py-2 bg-purple-900/30 text-purple-400 rounded-full text-sm">
                      {team.hackathon.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
              {/* Team Leader */}
              <div className="bg-gray-700/40 rounded-xl p-5 border border-gray-600/30">
                <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <FaUserShield className="text-purple-400 text-lg" />
                  Team Leader
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 flex items-center justify-center text-xl font-bold">
                    {team.teamLeader.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{team.teamLeader.name}</p>
                    <p className="text-gray-400 mt-1">{team.teamLeader.email}</p>
                    <Link 
                      to={`/profile/${team.teamLeader._id}`}
                      className="inline-block mt-2 px-3 py-1 bg-gray-600/50 hover:bg-gray-500/60 rounded-lg text-sm transition-colors"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <FaUsers className="text-purple-400 text-lg" />
                  Team Members
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {team.members.map((member) => (
                    <div key={member._id} className="flex justify-between items-center bg-gray-700/40 rounded-xl p-4 border border-gray-600/30">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-600/30 flex items-center justify-center text-lg font-bold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-sm text-gray-400 mt-1">{member.email}</p>
                        </div>
                      </div>
                      
                      <Link 
                        to={`/profile/${member._id}`}
                        className="px-3 py-2 bg-gray-600/50 hover:bg-gray-500/60 rounded-lg text-sm transition-colors"
                      >
                        View Profile
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project Idea */}
          {team.idea && (
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <FaClipboardCheck className="text-purple-400 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-200">Project Idea</h3>
              </div>
              
              <div className="p-4 bg-gray-700/30 rounded-lg">
                <p className="text-gray-300 whitespace-pre-line">{team.idea}</p>
              </div>
            </div>
          )}

          {/* Status Information */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700/40 rounded-xl p-5 border border-gray-600/30">
                <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <FaCheckCircle className="text-green-400 text-lg" />
                  Registration Status
                </h3>
                <div className={`text-lg font-semibold ${
                  team.isRegistered ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {team.isRegistered ? 'Registered for Hackathon' : 'Not Yet Registered'}
                </div>
                {/* {team.isRegistered && (
                  // <p className="text-gray-400 mt-2">
                  //   Registered on: {new Date(team.registrationDate).toLocaleDateString()}
                  // </p>
                )} */}
              </div>
              
              <div className="bg-gray-700/40 rounded-xl p-5 border border-gray-600/30">
                <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                  <FaUsers className="text-blue-400 text-lg" />
                  Team Status
                </h3>
                <div className="text-lg font-semibold">
                  {team.status === 'active' ? (
                    <span className="text-green-400">Active</span>
                  ) : team.status === 'pending' ? (
                    <span className="text-yellow-400">Pending Approval</span>
                  ) : team.status === 'suspended' ? (
                    <span className="text-red-400">Suspended</span>
                  ) : (
                    <span className="text-gray-400">Unknown</span>
                  )}
                </div>
                <p className="text-gray-400 mt-2">
                  Created on: {new Date(team.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTeamPage;