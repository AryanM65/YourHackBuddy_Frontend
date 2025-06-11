import { useState } from 'react';
import { useHackathon } from "../../contexts/HackathonContext";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTrophy, 
  FaRegClock, FaChartLine, FaCheck, FaClock, FaTimes,
  FaSpinner
} from "react-icons/fa";
import { MdComputer } from "react-icons/md";
import { RiLiveFill } from "react-icons/ri";

const AllHackathons = () => {
  const { hackathons, loading, updateHackathonStatus } = useHackathon();
  const { user } = useUser();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  // Apply filters based on user role
  const filteredHackathons = hackathons.filter(hackathon => {
    if (user?.role === 'Admin') return true;
    if (user?.role === 'Organization') {
      return (
        hackathon.organizerModel === "Organization" && 
        hackathon.organizer._id === user.organization._id
      );
    }
    return hackathon.status === 'Approved';
  });

  // Categorize by status for admin/organizers
  const approvedHackathons = filteredHackathons.filter(h => h.status === 'Approved');
  const pendingHackathons = filteredHackathons.filter(h => h.status === 'Pending');
  const rejectedHackathons = filteredHackathons.filter(h => h.status === 'Rejected');

  // Categorize approved hackathons by time
  const now = new Date();
  const upcomingHackathons = approvedHackathons.filter(h => new Date(h.startDate) > now);
  const currentHackathons = approvedHackathons.filter(h => 
    new Date(h.startDate) <= now && new Date(h.endDate) >= now
  );
  const pastHackathons = approvedHackathons.filter(h => new Date(h.endDate) < now);

  const handleStatusUpdate = async (hackathonId, status) => {
    try {
      setUpdatingId(hackathonId);
      await updateHackathonStatus(hackathonId, status);
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <br></br>
          <br></br>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hackathon Events</h1>
          {user.role === 'Student' && <p className="text-lg text-gray-600">Join exciting coding challenges and showcase your skills</p>}
          {user?.role === 'Admin' && (
            <button
              onClick={() => navigate('/all-hackathon-analytics')}
              className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <FaChartLine className="mr-2" />
              View Analytics
            </button>
          )}
        </div>

        {/* Status Sections for Admin/Organization */}
        {(user?.role === 'Admin' || user?.role === 'Organization') && (
          <>
            {/* Approved Section */}
            <StatusSection 
              title="Approved Hackathons"
              icon={<FaCheck className="text-green-500" />}
              hackathons={approvedHackathons}
              navigate={navigate}
              badgeType="status"
              emptyMessage="No approved hackathons"
              userRole={user?.role}
            />

            {/* Pending Section */}
            <StatusSection 
              title="Pending Approval"
              icon={<FaClock className="text-yellow-500" />}
              hackathons={pendingHackathons}
              navigate={navigate}
              badgeType="pending"
              emptyMessage="No pending hackathons"
              userRole={user?.role}
              onStatusUpdate={handleStatusUpdate}
              updatingId={updatingId}
            />

            {/* Rejected Section */}
            <StatusSection 
              title="Rejected Hackathons"
              icon={<FaTimes className="text-red-500" />}
              hackathons={rejectedHackathons}
              navigate={navigate}
              badgeType="rejected"
              emptyMessage="No rejected hackathons"
              userRole={user?.role}
            />
          </>
        )}

        {/* Time Sections for All Users */}
        {user?.role !== 'Admin' && user?.role !== 'Organization' && (
          <>
            {/* Current Hackathons */}
            {currentHackathons.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center mb-6">
                  <RiLiveFill className="text-red-500 text-2xl mr-3 animate-pulse" />
                  <h2 className="text-2xl font-bold text-gray-800">Live Now</h2>
                  <div className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    Happening Now
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentHackathons.map(hackathon => (
                    <HackathonCard 
                      key={hackathon._id} 
                      hackathon={hackathon} 
                      navigate={navigate}
                      badge="live"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Hackathons */}
            {upcomingHackathons.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center mb-6">
                  <FaRegClock className="text-blue-500 text-2xl mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Coming Soon</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingHackathons.map(hackathon => (
                    <HackathonCard 
                      key={hackathon._id} 
                      hackathon={hackathon} 
                      navigate={navigate}
                      badge="upcoming"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Past Hackathons */}
            {pastHackathons.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center mb-6">
                  <FaTrophy className="text-yellow-500 text-2xl mr-3" />
                  <h2 className="text-2xl font-bold text-gray-800">Past Events</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pastHackathons.map(hackathon => (
                    <HackathonCard 
                      key={hackathon._id} 
                      hackathon={hackathon} 
                      navigate={navigate}
                      badge="past"
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {filteredHackathons.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {user?.role === 'Organization'
                ? "You haven't organized any hackathons yet"
                : "No hackathons available"}
            </h3>
            <p className="text-gray-500">
              {user?.role === 'Organization'
                ? "Create your first hackathon to get started"
                : "Check back later for upcoming events"}
            </p>
            {user?.role === 'Organization' && (
              <button
                onClick={() => navigate('/create-hackathon')}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Create Hackathon
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// StatusSection component with admin actions
const StatusSection = ({ 
  title, 
  icon, 
  hackathons, 
  navigate, 
  badgeType, 
  emptyMessage, 
  userRole,
  onStatusUpdate,
  updatingId
}) => (
  <section className="mb-16">
    <div className="flex items-center mb-6">
      <div className="mr-3 text-2xl">
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <div className="ml-4 px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium">
        {hackathons.length} events
      </div>
    </div>
    
    {hackathons.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hackathons.map(hackathon => (
          <HackathonCard 
            key={hackathon._id} 
            hackathon={hackathon} 
            navigate={navigate}
            badge={badgeType}
            userRole={userRole}
            onStatusUpdate={onStatusUpdate}
            isUpdating={updatingId === hackathon._id}
          />
        ))}
      </div>
    ) : (
      <div className="text-center py-8 bg-gray-100 rounded-lg">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )}
  </section>
);

const HackathonCard = ({ 
  hackathon, 
  navigate, 
  badge, 
  userRole,
  onStatusUpdate,
  isUpdating
}) => {
  const now = new Date();
  const isLive = new Date(hackathon.startDate) <= now && new Date(hackathon.endDate) >= now;
  const isPast = new Date(hackathon.endDate) < now;

  // Determine gradient based on status or time
  let gradientClass = "";
  switch (hackathon.status) {
    case 'Pending':
      gradientClass = "bg-gradient-to-r from-yellow-500 to-yellow-600";
      break;
    case 'Rejected':
      gradientClass = "bg-gradient-to-r from-red-500 to-red-700";
      break;
    default:
      if (isPast) {
        gradientClass = "bg-gradient-to-r from-gray-500 to-gray-600";
      } else if (isLive) {
        gradientClass = "bg-gradient-to-r from-red-500 to-pink-600";
      } else {
        gradientClass = "bg-gradient-to-r from-purple-500 to-blue-600";
      }
  }

  return (
    <div
      onClick={() => navigate(`/hackathons/${hackathon._id}`)}
      className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group relative ${
        isPast ? "opacity-90 hover:opacity-100" : ""
      }`}
    >
      {/* Badge for event status */}
      {badge === "live" && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          LIVE
        </div>
      )}
      {badge === "upcoming" && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          COMING SOON
        </div>
      )}
      {badge === "past" && (
        <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          COMPLETED
        </div>
      )}
      {badge === "pending" && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          PENDING
        </div>
      )}
      {badge === "rejected" && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          REJECTED
        </div>
      )}

      {/* Admin approval buttons */}
      {userRole === 'Admin' && hackathon.status === 'Pending' && (
        <div className="absolute bottom-16 right-4 flex gap-2 z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log(hackathon);
              onStatusUpdate && onStatusUpdate(hackathon._id, 'Approved');
              navigate(`/hackathons/${hackathon._id}`)
            }}
            disabled={isUpdating}
            className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50 flex items-center"
          >
            {isUpdating ? (
              <FaSpinner className="animate-spin mr-1" />
            ) : (
              <FaCheck className="mr-1" />
            )}
            Approve
          </button>
          <button 
            onClick={(e) => {
              console.log("clicking");
              e.stopPropagation();
              e.preventDefault();
              onStatusUpdate && onStatusUpdate(hackathon._id, 'Rejected');
              navigate(`/hackathons/${hackathon._id}`);
            }}
            disabled={isUpdating}
            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 disabled:opacity-50 flex items-center"
          >
            {isUpdating ? (
              <FaSpinner className="animate-spin mr-1" />
            ) : (
              <FaTimes className="mr-1" />
            )}
            Reject
          </button>
        </div>
      )}

      <div className={`p-4 ${gradientClass}`}>
        <h2 className="text-xl font-bold text-white truncate">{hackathon.title}</h2>
      </div>

      <div className="p-6">
        <p className="text-gray-700 mb-4 line-clamp-3">
          {hackathon.description || "A hackathon focused on building innovative tech solutions"}
        </p>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <FaCalendarAlt className="mr-2 text-purple-500" />
            <span>
              {new Date(hackathon.startDate).toLocaleDateString()} -{" "}
              {new Date(hackathon.endDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-purple-500" />
            <span>{hackathon.location || "Virtual"}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <MdComputer className="mr-2 text-purple-500" />
            <span>{hackathon.mode || "Hybrid"} Event</span>
          </div>

          <div className="flex items-center text-gray-600">
            <FaUsers className="mr-2 text-purple-500" />
            <span>
              Teams: {hackathon.minTeamSize || 1}-{hackathon.maxTeamSize || 5} members
            </span>
          </div>
        </div>

        {hackathon.tags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {hackathon.tags.map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  hackathon.status === 'Rejected' || isPast
                    ? "bg-gray-200 text-gray-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {hackathon.teams?.length || 0} teams registered
        </span>
        <button className={`text-sm font-medium group-hover:underline ${
          hackathon.status === 'Rejected' || isPast 
            ? "text-gray-600" 
            : "text-purple-600 hover:text-purple-800"
        }`}>
          View Details →
        </button>
      </div>
    </div>
  );
};

export default AllHackathons;