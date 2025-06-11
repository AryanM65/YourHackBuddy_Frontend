import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeam } from "../../contexts/TeamContext";
import { useUser } from "../../contexts/UserContext";
import { 
  FaUsers, 
  FaUserShield, 
  FaKey, 
  FaClipboardCheck, 
  FaLink, 
  FaSpinner, 
  FaCopy,
  FaCheckCircle,
  FaExclamationTriangle,
  FaExclamationCircle
} from "react-icons/fa";

const YourTeam = () => {
  const { hackathonId } = useParams();
  const navigate = useNavigate();
  const { getUserTeamForHackathon, joinTeamByCode, generateJoinCode, registerTeamForHackathon } = useTeam();
  const { user } = useUser();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState("");
  const [joinSuccess, setJoinSuccess] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRegister = async () => {
    if (!team || !hackathonId) return;
    
    setRegisterLoading(true);
    setRegisterError("");
    
    try {
      const result = await registerTeamForHackathon({
        teamId: team._id,
        hackathonId
      });
      
      if (result && result.success) {
        const updatedTeam = await getUserTeamForHackathon(hackathonId);
        setTeam(updatedTeam);
      }
    } catch (err) {
      setRegisterError(err.message || "Registration failed");
    } finally {
      setRegisterLoading(false);
    }
  };

  useEffect(() => {
    const fetchYourTeam = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        const data = await getUserTeamForHackathon(hackathonId);
        if (data) {
          setTeam(data);
          setLoading(false);
        } else {
          setErrorMsg("You are not part of any team for this hackathon.");
          setTeam(null);
        }
      } catch (err) {
        setErrorMsg("Failed to load your team.");
      } finally {
        setLoading(false);
      }
    };

    if (hackathonId) fetchYourTeam();
  }, [hackathonId]);

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setJoinLoading(true);
    setJoinError("");
    setJoinSuccess("");

    if (!joinCode.trim()) {
      setJoinError("Please enter a join code.");
      setJoinLoading(false);
      return;
    }

    try {
      const result = await joinTeamByCode(joinCode.trim());
      if (result && result.team) {
        setJoinSuccess("Successfully joined the team!");
        setTeam(result.team);
        setJoinCode("");
        setErrorMsg("");
      } else {
        setJoinError("Failed to join the team with this code.");
      }
    } catch (err) {
      setJoinError(err.message || "Error joining team.");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleGenerateJoinCode = async () => {
    if (!team) return;
    setGenLoading(true);
    try {
      const newCode = await generateJoinCode(team._id);
      setTeam((prev) => ({ ...prev, joinCode: newCode }));
    } catch (err) {
      alert("Failed to generate join code.");
    } finally {
      setGenLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const isTeamLeader = team && user && team.teamLeader._id === user.id;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-gray-100 min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <FaUsers className="text-purple-400 text-3xl" />
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Team Management
        </h1>
      </div>

      {team?.suspended && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500/30 rounded-lg flex items-start gap-3">
          <FaExclamationCircle className="text-red-300 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-red-300 font-medium">Team Suspended</h3>
            <p className="text-red-200 text-sm mt-1">
              Your team has been suspended due to violation of our rules. 
              Please contact organizers for more information.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <FaSpinner className="animate-spin text-4xl text-purple-400" />
          <p className="text-gray-400">Loading team details...</p>
        </div>
      ) : errorMsg ? (
        <div className="space-y-6">
          <div className="p-4 bg-red-900/30 rounded-lg border border-red-500/30 flex items-center gap-3">
            <FaExclamationTriangle className="text-red-400 flex-shrink-0" />
            <p className="text-red-300">{errorMsg}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <FaKey className="text-purple-400" />
              <h2 className="text-xl font-semibold">Join Existing Team</h2>
            </div>
            
            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Enter Join Code</label>
                <div className="relative">
                  <input
                    id="joinCode"
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600/50 text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="XXXX-XXXX-XXXX"
                    disabled={joinLoading}
                  />
                  <FaLink className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {joinError && (
                <div className="p-3 bg-red-900/30 text-red-300 rounded-lg flex items-center gap-2">
                  <FaExclamationTriangle className="flex-shrink-0" />
                  {joinError}
                </div>
              )}

              {joinSuccess && (
                <div className="p-3 bg-green-900/30 text-green-300 rounded-lg flex items-center gap-2">
                  <FaCheckCircle className="flex-shrink-0" />
                  {joinSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={joinLoading}
                className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2"
              >
                {joinLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Joining Team...
                  </>
                ) : (
                  "Join Team"
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        team && (
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-purple-400">{team.name}</h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      team.isRegistered ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                    }`}>
                      {team.isRegistered ? 'Registered' : 'Unregistered'}
                    </span>
                    <span className="px-2 py-1 bg-blue-900/30 text-blue-400 rounded-full text-xs">
                      {team.members.length} Members
                    </span>
                  </div>
                </div>
                {!team.isRegistered && !team.suspended && (
                  <button
                    onClick={() => navigate(`/hackathon/${hackathonId}/teams/${team._id}/requests`)}
                    className="px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg flex items-center gap-2"
                  >
                    <FaClipboardCheck />
                    Requests
                  </button>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <FaUserShield className="text-purple-400" />
                  Team Leader
                </h3>
                <div className="flex items-center gap-3 bg-gray-700/30 rounded-lg p-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    {team.teamLeader.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{team.teamLeader.name}</p>
                    <p className="text-sm text-gray-400">{team.teamLeader.email}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  <FaUsers className="text-purple-400" />
                  Team Members
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {team.members.map((member) => (
                    <div key={member._id} className="flex items-center gap-3 bg-gray-700/30 rounded-lg p-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {isTeamLeader && !team.isRegistered && !team.suspended && (
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                    <FaKey className="text-purple-400" />
                    Team Join Code
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                      <input
                        value={team.joinCode || "No active code"}
                        readOnly
                        className="w-full pl-4 pr-12 py-3 bg-gray-700/50 rounded-lg border border-gray-600/50 text-gray-300 font-mono"
                      />
                      {team.joinCode && (
                        <button
                          onClick={() => copyToClipboard(team.joinCode)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-600/30 rounded-lg"
                          title="Copy to clipboard"
                        >
                          {copied ? (
                            <FaCheckCircle className="text-green-400" />
                          ) : (
                            <FaCopy className="text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>
                    <button
                      onClick={handleGenerateJoinCode}
                      disabled={genLoading}
                      className="px-4 py-3 bg-purple-600/30 hover:bg-purple-500/30 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      {genLoading ? (
                        <FaSpinner className="animate-spin" />
                      ) : team.joinCode ? (
                        "Regenerate"
                      ) : (
                        "Generate Code"
                      )}
                    </button>
                  </div>
                </div>
              )}

              {isTeamLeader && !team.isRegistered && !team.suspended && (
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Hackathon Registration</h3>
                      <p className="text-sm text-gray-500">Register your team for the hackathon</p>
                    </div>
                    <button
                      onClick={handleRegister}
                      disabled={registerLoading}
                      className="px-6 py-3 bg-green-600/30 hover:bg-green-500/30 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      {registerLoading ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Registering...
                        </>
                      ) : (
                        "Register Team"
                      )}
                    </button>
                  </div>
                  {registerError && (
                    <div className="mt-4 p-3 bg-red-900/30 text-red-300 rounded-lg flex items-center gap-2">
                      <FaExclamationTriangle />
                      {registerError}
                    </div>
                  )}
                </div>
              )}
              
              {team.isRegistered && !team.suspended && (
                <button 
                  onClick={() => navigate(`/${hackathonId}/upload-resume`)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Upload Resumes
                </button>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default YourTeam;