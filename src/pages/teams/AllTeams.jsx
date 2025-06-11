import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeam } from "../../contexts/TeamContext";
import { useUser } from "../../contexts/UserContext";
import { 
  FaUsers, FaUserShield, FaUserPlus, FaClock, 
  FaCheckCircle, FaSearch, FaEnvelope, FaCode, 
  FaUniversity, FaSchool, FaUserFriends,
  FaStar, FaFileAlt // Added new icons
} from "react-icons/fa";

const AllTeams = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const { 
    teams, 
    loading, 
    error,
    getTeamsForHackathon,
    sendTeamJoinRequest,
    getUserTeamForHackathon,
    toggleTeamShortlist // Added from context
  } = useTeam();
  const { user } = useUser();
  
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState('all');
  const [userTeam, setUserTeam] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(new Set());

  // Fetch teams and user's team data
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getTeamsForHackathon(hackathonId);
        const userTeamData = await getUserTeamForHackathon(hackathonId);
        console.log("userTeamData",userTeamData);
        setUserTeam(userTeamData);
        console.log("teaming", teams);
      } catch (err) {
        console.error("Error fetching teams:", err);
      }
    };
    fetchData();
  }, [hackathonId]);

  // Filter teams based on view mode and search term
  useEffect(() => {
    console.log("teams", teams);
    let filtered = teams;
    
    // Filter by institute if view mode is 'institute' and user has institute info
    if (viewMode === 'institute' && user?.institute) {
      filtered = filtered.filter(team => 
        team.teamLeader?.institute === user.institute
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(team =>
        team.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTeams(filtered);
  }, [searchTerm, teams, viewMode, user]);

  // Handle sending join request to a team
  const handleSendRequest = async (teamId) => {
    if (!user) return;
    try {
      await sendTeamJoinRequest({ teamId, message: `Hi! I'd like to join your team.` });
      setPendingRequests(prev => new Set([...prev, teamId]));
    } catch (err) {
      console.error("Failed to send request:", err);
    }
  };

  // Handle shortlisting a team (only shortlist, no unshortlist)
  const handleShortlistTeam = async (teamId) => {
    try {
      await toggleTeamShortlist(teamId, true); // Always set to true
    } catch (err) {
      console.error("Failed to shortlist team:", err);
    }
  };

  const canRequestToJoin = !userTeam && user;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <br></br>
          <br></br>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            <FaUsers className="inline mr-2 text-blue-500" />
            {viewMode === 'all' ? 'Hackathon Teams' : 'Institute Teams'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {viewMode === 'all' 
              ? 'Find teams to collaborate with' 
              : 'Teams from your institution'}
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search teams by name..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('all')}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 transition ${
                viewMode === 'all' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <FaUsers /> All Teams
            </button>
            <button
              onClick={() => setViewMode('institute')}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 transition ${
                viewMode === 'institute' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              disabled={!user?.institute}
              title={!user?.institute ? "Your institute information is required" : ""}
            >
              <FaSchool /> My Institute
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : 
        
        /* Empty State */
        filteredTeams.length === 0 ? (
          <div className="text-center py-10">
            <FaUserFriends className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
              {searchTerm 
                ? "No teams match your search" 
                : viewMode === 'all' 
                  ? "No teams for this hackathon yet" 
                  : user?.institute
                    ? "No teams from your institution yet"
                    : "Please set your institute information to view institute teams"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {searchTerm 
                ? "Try a different search term" 
                : "Be the first to create a team!"}
            </p>
          </div>
        ) : 
        
        /* Team List */
        (
          <div className="grid gap-6">
            {filteredTeams.map(team => (
              <TeamCard 
                key={team._id}
                team={team}
                user={user}
                userTeam={userTeam}
                pendingRequests={pendingRequests}
                canRequestToJoin={canRequestToJoin}
                onSendRequest={handleSendRequest}
                onShortlistTeam={handleShortlistTeam} // Pass new handler
                hackathonId={hackathonId} // Pass hackathonId for navigation
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// TeamCard Component
const TeamCard = ({ 
  team, 
  user, 
  userTeam, 
  pendingRequests, 
  canRequestToJoin, 
  onSendRequest,
  onShortlistTeam,
  hackathonId
}) => {
  const navigate = useNavigate();
  const isMember = team.members?.some(m => m._id === user?._id);
  const isLeader = team.teamLeader?._id === user?._id;
  const hasPending = pendingRequests.has(team._id);
  const membersCount = team.members?.length || 0;
  
  // Function to navigate to submissions page
  const handleViewSubmissions = (e) => {
    e.stopPropagation();
    navigate(`/hackathons/${hackathonId}/teams/${team._id}/submissions`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {team.name}
              </h3>
              {/* SHORTLISTED BADGE - only show if team is shortlisted */}
              {console.log("team.shortlisted", team.shortlisted)}
              {team.shortlisted && (
                <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full flex items-center gap-1">
                  <FaStar className="text-yellow-500" /> Shortlisted
                </span>
              )}
              {isLeader && (
                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                  Your Team
                </span>
              )}
            </div>
            
            {team.idea && (
              <p className="text-gray-600 dark:text-gray-300 mt-2">{team.idea}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center gap-1">
                <FaUsers className="text-blue-500" /> {membersCount} member{membersCount !== 1 ? 's' : ''}
              </span>
              
              <span className={`text-sm px-3 py-1 rounded-full flex items-center gap-1 ${
                team.isRegistered 
                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                  : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              }`}>
                {team.isRegistered ? <FaCheckCircle /> : <FaClock />}
                {team.isRegistered ? 'Registered' : 'Forming'}
              </span>
              
              {team.teamLeader?.institute && (
                <span className="text-sm px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full flex items-center gap-1">
                  <FaUniversity /> {team.teamLeader.institute}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2">
            {/* JOIN TEAM BUTTON */}
            {canRequestToJoin && !isMember && !isLeader && (
              <button
                onClick={() => onSendRequest(team._id)}
                disabled={hasPending || team.isRegistered}
                className={`px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition ${
                  hasPending || team.isRegistered
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                }`}
              >
                {team.isRegistered ? (
                  <>
                    <FaCheckCircle /> Closed
                  </>
                ) : hasPending ? (
                  <>
                    <FaClock /> Pending
                  </>
                ) : (
                  <>
                    <FaUserPlus /> Join Team
                  </>
                )}
              </button>
            )}
            
            {/* ADMIN/ORGANIZATION ACTIONS */}
            {(user?.role === 'Admin' || user?.role === 'Organization') && (
              <div className="flex gap-2">
                {/* SHORTLIST BUTTON - only show if team is NOT shortlisted */}
                {!team.shortlisted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShortlistTeam(team._id);
                    }}
                    className="px-4 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium flex items-center gap-2"
                  >
                    <FaStar /> Shortlist Team
                  </button>
                )}
                
                {/* VIEW SUBMISSIONS BUTTON - always visible for admins/orgs */}
                <button
                  onClick={handleViewSubmissions}
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <FaFileAlt /> View Submissions
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Team Members Preview */}
        {team.members?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Team Members:
            </h4>
            <div className="flex flex-wrap gap-2">
              {team.members.slice(0, 5).map(member => (
                <div key={member._id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                  {member.profilePicture ? (
                    <img 
                      src={member.profilePicture} 
                      alt={member.name} 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm">
                    {member._id === user?._id ? 'You' : member.name.split(' ')[0]}
                    {member._id === team.teamLeader?._id && (
                      <FaUserShield className="ml-1 text-yellow-500 inline" title="Team Leader" />
                    )}
                  </span>
                </div>
              ))}
              {team.members.length > 5 && (
                <div className="bg-gray-50 dark:bg-gray-700 px-3 py-1.5 rounded-full text-sm">
                  +{team.members.length - 5} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTeams;