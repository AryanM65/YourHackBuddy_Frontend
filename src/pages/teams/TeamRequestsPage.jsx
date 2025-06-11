import React, { useEffect, useState } from 'react';
import { useTeam } from '../../contexts/TeamContext';
import { useUser } from '../../contexts/UserContext';

const TeamRequestsPage = () => {
  const { currentTeam, getTeamRequests, handleTeamRequestResponse, loading, error } = useTeam();
  const { user } = useUser();
  const [requests, setRequests] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    const loadRequests = async () => {
        console.log("currentTeam", currentTeam);
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
  console.log(user);
  console.log(currentTeam);

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
      <div className="p-4 text-red-500">
        You must be the team leader to view join requests.
      </div>
    );
  }

  if (localLoading) return <div className="p-4">Loading requests...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Team Join Requests</h1>
      
      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests</p>
      ) : (
        <div className="space-y-4">
          {requests.map(request => (
            <div key={request._id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {request.from.name || request.from.email}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Requested to join {currentTeam.name}
                  </p>
                  <span className={`text-sm ${
                    request.status === 'pending' ? 'text-yellow-600' :
                    request.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {request.status.toUpperCase()}
                  </span>
                </div>
                
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecision(request._id, 'accept')}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecision(request._id, 'reject')}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamRequestsPage;