import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeam } from '../../contexts/TeamContext';
import { useHackathon } from '../../contexts/HackathonContext';
import { FaFileAlt, FaUser, FaUserTimes, FaDownload, FaArrowLeft } from 'react-icons/fa';
import { useUser } from '../../contexts/UserContext';

const TeamSubmissionsPage = () => {
  const { teamId, hackathonId } = useParams();
  const navigate = useNavigate();
  const { getTeamById, getTeamSubmissions, loading, error } = useTeam();
  const { fetchHackathonById } = useHackathon();
  const { user } = useUser();
  
  const [team, setTeam] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [hackathon, setHackathon] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamData = await getTeamById(teamId);
        const hackathonData = await fetchHackathonById(hackathonId);
        const submissionData = await getTeamSubmissions(teamId, hackathonId);
        setTeam(teamData);
        setHackathon(hackathonData);
        setSubmission(submissionData);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    
    fetchData();
  }, [teamId, hackathonId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!team || !hackathon) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <p className="text-gray-600 text-center">Team or hackathon not found</p>
      </div>
    );
  }

  // Check if user has permission to view
  //const isTeamMember = team.members?.some(m => m._id === user?._id);
  const isHackathonOrganizer = hackathon.data.organizer?._id === user?.organization?._id || 
                              hackathon.data.organizer?._id === user?._id;
  const isAdmin = user?.role === 'Admin' || user?.role === 'Organization';
  
  const isAllowed = isHackathonOrganizer || isAdmin;

  if (!isAllowed) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>You don't have permission to view these submissions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <br></br>
        <br></br>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-purple-600 hover:text-purple-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {team.name}'s Resumes
                </h1>
                <p className="text-gray-600 mt-1">
                  For: {hackathon.data.title}
                </p>
              </div>
              
              {team.shortlisted && (
                <span className="mt-2 md:mt-0 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center">
                  <FaUser className="mr-1" /> Shortlisted
                </span>
              )}
            </div>
          </div>
          
          {/* Resumes Section */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FaFileAlt className="text-blue-500 mr-2" />
              Team Resumes
            </h2>
            
            <div className="space-y-4">
              {team.members?.map(member => {
                const resume = submission?.resumes?.find(r => r.user._id === member._id);
                const initial = member.name?.charAt(0).toUpperCase() || '?';
                
                return (
                  <div 
                    key={member._id} 
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white mr-3">
                        {initial}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.name}
                          {team.teamLeader?._id === member._id && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Leader
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          {member.institute || 'No institute provided'}
                        </p>
                      </div>
                    </div>
                    
                    {resume ? (
                      <a 
                        href={resume.resumeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                      >
                        <FaDownload className="mr-2" />
                        Resume
                      </a>
                    ) : (
                      <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-md flex items-center">
                        <FaUserTimes className="mr-2" />
                        Not submitted
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Organization Actions */}
        {/* {(user?.role === 'Organization' || user?.role === 'Admin') && isHackathonOrganizer && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Organization Actions
            </h2>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate(`/hackathons/${hackathonId}/teams/${teamId}/evaluate`)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <FaUser /> Evaluate Team
              </button>
              
              <button
                onClick={() => navigate(`/hackathons/${hackathonId}/teams/${teamId}/contact`)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2"
              >
                <FaUser /> Contact Team
              </button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default TeamSubmissionsPage;