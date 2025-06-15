import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../../contexts/TeamContext';
import { useUser } from '../../contexts/UserContext';
import { FaUserCircle, FaCheck, FaTimes, FaExternalLinkAlt, FaUserAlt } from 'react-icons/fa';

const TeamRequestsPage = () => {
  const { currentTeam, getTeamRequests, handleTeamRequestResponse, loading, error } = useTeam();
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRequests = async () => {
      if (currentTeam?._id && isTeamLeader()) {
        setLocalLoading(true);
        try {
          const requests = await getTeamRequests(currentTeam._id);
          setRequests(requests);
        } finally {
          setLocalLoading(false);
        }
      }
    };
    loadRequests();
  }, [currentTeam]);

  const isTeamLeader = () => {
    return user?.id === currentTeam?.teamLeader._id?.toString();
  };

  const handleDecision = async (requestId, action) => {
    try {
      await handleTeamRequestResponse(requestId, action);
      // Refresh requests after action
      const updatedRequests = await getTeamRequests(currentTeam._id);
      setRequests(updatedRequests);
    } catch (error) {
      console.error('Error handling request:', error);
    }
  };

  if (!currentTeam || !isTeamLeader()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center">
          <FaUserCircle className="mx-auto text-5xl text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You must be the team leader to view join requests.
          </p>
        </div>
      </div>
    );
  }

  if (localLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md p-6 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-xl">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <br></br>
      <br></br>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Team Join Requests
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage requests to join <span className="font-semibold text-blue-600 dark:text-blue-400">{currentTeam.name}</span>
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <FaUserCircle className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No pending requests
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              You don't have any pending join requests at this time.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map(request => (
              <div 
                key={request._id} 
                className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {request.from.profilePicture ? (
                        <img 
                          src={request.from.profilePicture} 
                          alt={request.from.name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          <FaUserCircle className="text-xl" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                          {request.from.name || request.from.email}
                        </h3>
                        
                        {/* View Profile Button */}
                        <button
                          onClick={() => navigate(`/profile/${request.from._id}`)}
                          className="mt-1 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition"
                        >
                          <FaUserAlt className="text-xs" />
                          <span>View Profile</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Request Message */}
                    {request.message && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                          Message:
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <p className="text-gray-700 dark:text-gray-300 italic">
                            "{request.message}"
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 flex items-center gap-2">
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        request.status === 'pending' 
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' 
                          : request.status === 'accepted' 
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                      }`}>
                        {request.status.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-2 sm:self-center">
                      <button
                        onClick={() => handleDecision(request._id, 'accept')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition"
                      >
                        <FaCheck /> Accept
                      </button>
                      <button
                        onClick={() => handleDecision(request._id, 'reject')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition"
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamRequestsPage;