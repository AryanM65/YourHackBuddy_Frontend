import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  FaExclamationCircle,
  FaArrowLeft
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
        navigate(`/hackathons/${hackathonId}`);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100">
      <br></br>
      <br></br>
      <br></br>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/hackathons/${hackathonId}`)}
          className="mb-8 flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
        >
          <FaArrowLeft className="mt-0.5" />
          <span>Back to Hackathon</span>
        </button>
        
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 shadow-lg">
            <FaUsers className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Team Management
            </h1>
            <p className="text-gray-400 mt-1">Manage your team for this hackathon</p>
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
                Your team has been suspended due to violation of our rules. 
                Please contact organizers for more information.
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-500 rounded-full animate-spin animation-delay-75"></div>
            </div>
            <p className="text-gray-400">Loading team details...</p>
          </div>
        ) : errorMsg ? (
          <div className="space-y-8">
            <div className="p-4 bg-red-900/30 rounded-xl border border-red-500/30 flex items-center gap-4 backdrop-blur-sm">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <FaExclamationTriangle className="text-red-300 text-xl" />
              </div>
              <p className="text-red-300 text-lg">{errorMsg}</p>
            </div>

            <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-purple-600/20 rounded-xl">
                  <FaKey className="text-purple-300 text-xl" />
                </div>
                <h2 className="text-2xl font-semibold">Join Existing Team</h2>
              </div>
              
              <form onSubmit={handleJoinTeam} className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider">Enter Join Code</label>
                  <div className="relative">
                    <input
                      id="joinCode"
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-700/50 rounded-xl border border-gray-600/50 text-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono tracking-wider"
                      placeholder="XXXX-XXXX-XXXX"
                      disabled={joinLoading}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-purple-600/30 rounded-lg">
                      <FaLink className="text-purple-300" />
                    </div>
                  </div>
                </div>

                {joinError && (
                  <div className="p-4 bg-red-900/30 text-red-300 rounded-xl flex items-center gap-3">
                    <FaExclamationTriangle className="flex-shrink-0 text-xl" />
                    <span className="font-medium">{joinError}</span>
                  </div>
                )}

                {joinSuccess && (
                  <div className="p-4 bg-green-900/30 text-green-300 rounded-xl flex items-center gap-3">
                    <FaCheckCircle className="flex-shrink-0 text-xl" />
                    <span className="font-medium">{joinSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={joinLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-purple-500/20"
                >
                  {joinLoading ? (
                    <>
                      <FaSpinner className="animate-spin text-xl" />
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
                  {!team.isRegistered && !team.suspended && (
                    <button
                      onClick={() => navigate(`/hackathon/${hackathonId}/teams/${team._id}/requests`)}
                      className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 rounded-xl flex items-center gap-3 font-medium"
                    >
                      <FaClipboardCheck />
                      View Requests
                    </button>
                  )}
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
                        {team.teamLeader._id !== user.id && (
                          <Link 
                            to={`/profile/${team.teamLeader._id}`}
                            className="inline-block mt-2 px-3 py-1 bg-gray-600/50 hover:bg-gray-500/60 rounded-lg text-sm transition-colors"
                          >
                            View Profile
                          </Link>
                        )}
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
                          
                          {member._id === user.id ? (
                            <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs">
                              You
                            </span>
                          ) : (
                            <Link 
                              to={`/profile/${member._id}`}
                              className="px-3 py-2 bg-gray-600/50 hover:bg-gray-500/60 rounded-lg text-sm transition-colors"
                            >
                              View Profile
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Actions */}
              {isTeamLeader && !team.isRegistered && !team.suspended && (
                <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Join Code Section */}
                    <div className="bg-gray-700/40 rounded-xl p-5 border border-gray-600/30">
                      <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <FaKey className="text-purple-400 text-lg" />
                        Team Join Code
                      </h3>
                      <div className="flex flex-col gap-4">
                        <div className="relative">
                          <input
                            value={team.joinCode || "No active code"}
                            readOnly
                            className="w-full pl-5 pr-16 py-4 bg-gray-600/30 rounded-xl border border-gray-500/30 text-gray-300 font-mono tracking-wider text-lg"
                          />
                          {team.joinCode && (
                            <button
                              onClick={() => copyToClipboard(team.joinCode)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 hover:bg-gray-600/40 rounded-xl"
                              title="Copy to clipboard"
                            >
                              {copied ? (
                                <FaCheckCircle className="text-green-400 text-xl" />
                              ) : (
                                <FaCopy className="text-gray-400 text-xl" />
                              )}
                            </button>
                          )}
                        </div>
                        <button
                          onClick={handleGenerateJoinCode}
                          disabled={genLoading}
                          className="w-full py-3 px-6 bg-purple-600/30 hover:bg-purple-500/40 rounded-xl flex items-center justify-center gap-3 font-medium transition-colors"
                        >
                          {genLoading ? (
                            <FaSpinner className="animate-spin text-xl" />
                          ) : team.joinCode ? (
                            "Regenerate Code"
                          ) : (
                            "Generate Join Code"
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Registration Section */}
                    <div className="bg-gray-700/40 rounded-xl p-5 border border-gray-600/30">
                      <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <FaClipboardCheck className="text-purple-400 text-lg" />
                        Hackathon Registration
                      </h3>
                      <div className="space-y-6">
                        <p className="text-gray-300">
                          Register your team to participate in the hackathon. Once registered, you'll be able to submit projects.
                        </p>
                        <div>
                          <button
                            onClick={handleRegister}
                            disabled={registerLoading}
                            className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold hover:from-green-500 hover:to-emerald-500 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-emerald-500/20"
                          >
                            {registerLoading ? (
                              <>
                                <FaSpinner className="animate-spin text-xl" />
                                Registering...
                              </>
                            ) : (
                              "Register Team"
                            )}
                          </button>
                          {registerError && (
                            <div className="mt-4 p-4 bg-red-900/30 text-red-300 rounded-xl flex items-center gap-3">
                              <FaExclamationTriangle className="text-xl" />
                              <span className="font-medium">{registerError}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {team.isRegistered && !team.suspended && (
                <div className="text-center">
                  <button 
                    onClick={() => navigate(`/${hackathonId}/upload-resume`)}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-purple-500/20"
                  >
                    Upload Team Resumes
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default YourTeam;