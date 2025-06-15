import React, { useEffect, useCallback, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useTeam } from '../contexts/TeamContext';
import { useHackathon } from '../contexts/HackathonContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaEdit, 
  FaGithub, 
  FaLinkedin, 
  FaUsers, 
  FaCalendarAlt, 
  FaTrophy, 
  FaUniversity, 
  FaBriefcase, 
  FaUserFriends,
  FaCode,
  FaIdBadge,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const UserDashboard = () => {
  const { user, loading: userLoading } = useUser();
  const { 
    getUserTeams, 
    teams, 
    loading: teamsLoading 
  } = useTeam();
  const { 
    myHackathons, 
    fetchMyHackathons, 
    loading: hackathonsLoading 
  } = useHackathon();
  const navigate = useNavigate();
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [showAllTeams, setShowAllTeams] = useState(false);
  const [showAllHackathons, setShowAllHackathons] = useState(false);
  
  // Number of items to show initially
  const INITIAL_TEAMS_TO_SHOW = 2;
  const INITIAL_HACKATHONS_TO_SHOW = 2;

  const fetchData = useCallback(async () => {
    if (!user?._id || initialLoadComplete) return;
    
    try {
      await Promise.all([
        getUserTeams(user._id),
        fetchMyHackathons()
      ]);
      setInitialLoadComplete(true);
    } catch (error) {
      console.error("Data fetch error:", error);
    }
  }, [user?._id, getUserTeams, fetchMyHackathons, initialLoadComplete]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Calculate teams to display
  const displayedTeams = showAllTeams 
    ? teams 
    : teams.slice(0, INITIAL_TEAMS_TO_SHOW);
  
  // Calculate hackathons to display
  const displayedHackathons = showAllHackathons 
    ? myHackathons 
    : myHackathons.slice(0, INITIAL_HACKATHONS_TO_SHOW);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <br></br>
      <br></br>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Welcome Back, {user?.name}
            </h1>
            {user?.role === 'Admin' && (
              <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                Admin
              </span>
            )}
          </div>
          <button
            onClick={() => navigate('/edit-profile')}
            className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all flex items-center gap-2"
          >
            <FaEdit className="w-5 h-5" />
            Edit Profile
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1 bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="flex flex-col items-center mb-6">
              {user?.profilePicture ? (
                <img 
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-purple-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-4xl font-bold mb-4">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className="text-2xl font-semibold mb-2">{user?.name}</h2>
              <p className="text-gray-400">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm">
                  {user?.designation}
                </span>
                {user?.role !== 'Admin' && user?.institute && (
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm">
                    {user.institute}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Organization */}
              {user?.organization && (
                <div className="p-4 bg-gray-700/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <FaBriefcase className="text-purple-400 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">{user.organization.name}</h3>
                      {user.organization.website && (
                        <a
                          href={user.organization.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 text-sm"
                        >
                          {user.organization.website}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Current Team */}
              {user?.currentTeam && (
                <div className="p-4 bg-gray-700/20 rounded-lg">
                  <h3 className="text-purple-400 font-semibold mb-3 flex items-center gap-2">
                    <FaUsers /> Current Team
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{user.currentTeam.teamName}</h4>
                      <div className="flex items-center mt-2 -space-x-2">
                        {user.currentTeam.members.slice(0, 5).map((member, index) => (
                          <img
                            key={index}
                            src={member.profilePicture || `https://ui-avatars.com/api/?name=${member.name}`}
                            className="w-8 h-8 rounded-full border-2 border-purple-500"
                            alt={member.name}
                          />
                        ))}
                        {user.currentTeam.members.length > 5 && (
                          <span className="ml-2 text-purple-400 text-sm">
                            +{user.currentTeam.members.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs">
                      {user.currentTeam.status}
                    </span>
                  </div>
                </div>
              )}

              {/* Bio */}
              {user?.bio && (
                <div className="p-4 bg-gray-700/20 rounded-lg">
                  <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                    <FaIdBadge /> Bio
                  </h3>
                  <p className="text-gray-300 whitespace-pre-line">{user.bio}</p>
                </div>
              )}

              {/* Skills */}
              {user?.skills?.length > 0 && (
                <div className="p-4 bg-gray-700/20 rounded-lg">
                  <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                    <FaCode /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(user?.github || user?.linkedin) && (
                <div className="p-4 bg-gray-700/20 rounded-lg">
                  <h3 className="text-purple-400 font-semibold mb-2">Social Links</h3>
                  <div className="flex gap-4">
                    {user?.github && (
                      <a
                        href={user.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-purple-400 transition-colors"
                      >
                        <FaGithub className="w-6 h-6" />
                      </a>
                    )}
                    {user?.linkedin && (
                      <a
                        href={user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-purple-400 transition-colors"
                      >
                        <FaLinkedin className="w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Teams & Hackathons */}
          <div className="lg:col-span-2 space-y-8">
            {/* Teams Section */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <FaUsers className="text-purple-400" />
                  Your Teams
                </h2>
                <div className="text-sm text-purple-400">
                  {teams.length} {teams.length === 1 ? 'team' : 'teams'}
                </div>
              </div>

              {teamsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : teams?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayedTeams.map((team) => (
                      <div
                        key={team._id}
                        className="p-4 bg-gray-700/20 rounded-lg hover:bg-gray-700/30 transition-colors"
                      >
                        <h3 className="font-semibold mb-2">{team.name}</h3>
                        <p className="text-sm text-gray-400 mb-2">
                          {team.hackathon?.name || 'General Team'}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-purple-400">
                            {team.members.length} members
                          </span>
                          <span className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs">
                            {team.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {teams.length > INITIAL_TEAMS_TO_SHOW && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setShowAllTeams(!showAllTeams)}
                        className="px-4 py-2 text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2 mx-auto"
                      >
                        {showAllTeams ? (
                          <>
                            <FaChevronUp className="text-xs" />
                            Show Less Teams
                          </>
                        ) : (
                          <>
                            <FaChevronDown className="text-xs" />
                            View All Teams ({teams.length})
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  You're not part of any teams yet. Join or create one!
                </div>
              )}
            </div>

            {/* Hackathons Section */}
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <FaTrophy className="text-purple-400" />
                  Your Hackathons
                </h2>
                <div className="text-sm text-purple-400">
                  {myHackathons.length} {myHackathons.length === 1 ? 'hackathon' : 'hackathons'}
                </div>
              </div>

              {hackathonsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : myHackathons?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayedHackathons.map((hackathon) => (
                      <div
                        key={hackathon._id}
                        className="p-4 bg-gray-700/20 rounded-lg hover:bg-gray-700/30 transition-colors"
                      >
                        <h3 className="font-semibold mb-2">{hackathon.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                          <FaCalendarAlt />
                          <span>
                            {new Date(hackathon.startDate).toLocaleDateString()} -{' '}
                            {new Date(hackathon.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-purple-400">
                            {hackathon.status}
                          </span>
                          <span className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs">
                            {hackathon.teams?.length || 0} teams
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {myHackathons.length > INITIAL_HACKATHONS_TO_SHOW && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setShowAllHackathons(!showAllHackathons)}
                        className="px-4 py-2 text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2 mx-auto"
                      >
                        {showAllHackathons ? (
                          <>
                            <FaChevronUp className="text-xs" />
                            Show Less Hackathons
                          </>
                        ) : (
                          <>
                            <FaChevronDown className="text-xs" />
                            View All Hackathons ({myHackathons.length})
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 text-gray-400">
                  You haven't joined any hackathons yet. Find one to participate in!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;