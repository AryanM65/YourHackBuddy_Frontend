import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useTeam } from "../contexts/TeamContext";

const Home = () => {
  const { user } = useUser();
  const { getUserTeams, getOngoingHackathons } = useTeam();
  const [userTeams, setUserTeams] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsData, hacksData] = await Promise.all([
          getUserTeams(),
          getOngoingHackathons()
        ]);
        setUserTeams(teamsData);
        setHackathons(hacksData);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <br></br>
        <br></br>
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">
              {userTeams.length > 0 
                ? `You're part of ${userTeams.length} teams`
                : "Get started by joining or creating a team"}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <img 
              src={user?.avatar || "/default-avatar.png"} 
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Link 
            to="/create-team"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Create New Team</h3>
            <p className="text-gray-600 text-sm">Start a new team for an upcoming hackathon</p>
          </Link>

          <Link 
            to="/requests"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">View Requests</h3>
            <p className="text-gray-600 text-sm">Manage your pending team requests</p>
          </Link>

          <Link 
            to="/hackathons"
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Browse Hackathons</h3>
            <p className="text-gray-600 text-sm">Explore current and upcoming events</p>
          </Link>
        </div>

        {/* Ongoing Hackathons */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ongoing Hackathons</h2>
          {loading ? (
            <p className="text-gray-600">Loading hackathons...</p>
          ) : hackathons.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {hackathons.map(hackathon => (
                <Link
                  key={hackathon._id}
                  to={`/hackathon/${hackathon._id}`}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-800">{hackathon.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {hackathon.date} • {hackathon.location}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No ongoing hackathons found</p>
          )}
        </div>

        {/* Your Teams */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Teams</h2>
          {loading ? (
            <p className="text-gray-600">Loading teams...</p>
          ) : userTeams.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {userTeams.map(team => (
                <Link
                  key={team._id}
                  to={`/team/${team._id}`}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <h3 className="font-semibold text-gray-800">{team.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {team.members.length} members • {team.hackathon?.name}
                  </p>
                  <span className="inline-block mt-2 text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">
                    {team.isRegistered ? "Registered" : "Draft"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You're not part of any teams yet</p>
              <Link
                to="/create-team"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Your First Team
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;