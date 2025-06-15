import { useState } from 'react';
import { useHackathon } from "../../contexts/HackathonContext";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTrophy, 
  FaRegClock, FaChartLine, FaCheck, FaClock, FaTimes,
  FaSpinner, FaCode
} from "react-icons/fa";
import { MdComputer } from "react-icons/md";
import { RiLiveFill } from "react-icons/ri";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
      <p className="text-blue-600 font-medium">Loading...</p>
    </div>
  </div>
);

const UnauthorizedMessage = () => (
  <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md">
      <div className="mx-auto h-20 w-20 text-red-500 mb-6">
        <FaTimes className="w-full h-full" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h3>
      <p className="text-gray-600 mb-6">
        You need to be logged in to view hackathons.
      </p>
      <button
        onClick={() => window.location.href = '/login'}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
      >
        Go to Login Page
      </button>
    </div>
  </div>
);

const AllHackathons = () => {
  const { hackathons, loading, updateHackathonStatus } = useHackathon();
  const { user, loading: userLoading } = useUser();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);

  // Show loading state
  if (loading || userLoading) {
    return <LoadingSpinner />;
  }

  // Handle unauthenticated users
  if (!user) {
    return <UnauthorizedMessage />;
  }

  // Apply filters based on user role
  const filteredHackathons = hackathons.filter(hackathon => {
    if (user?.role === 'Admin') return true;
    if (user?.role === 'Organization') {
      return (
        hackathon?.organizerModel === "Organization" && 
        hackathon?.organizer?._id === user?.organization?._id
      );
    }
    return hackathon?.status === 'Approved';
  });

  // Categorize by status for admin/organizers
  const approvedHackathons = filteredHackathons.filter(h => h?.status === 'Approved');
  const pendingHackathons = filteredHackathons.filter(h => h?.status === 'Pending');
  const rejectedHackathons = filteredHackathons.filter(h => h?.status === 'Rejected');

  // Categorize approved hackathons by time
  const now = new Date();
  const upcomingHackathons = approvedHackathons.filter(h => new Date(h?.startDate) > now);
  const currentHackathons = approvedHackathons.filter(h => 
    new Date(h?.startDate) <= now && new Date(h?.endDate) >= now
  );
  const pastHackathons = approvedHackathons.filter(h => new Date(h?.endDate) < now);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-16 pt-8">
          <div className="inline-flex items-center justify-center p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg mb-8">
            <FaCode className="text-4xl text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Hackathon Events
          </h1>
          {user?.role === 'Student' && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Join exciting coding challenges and showcase your skills
            </p>
          )}
          {user?.role === 'Admin' && (
            <button
              onClick={() => navigate('/all-hackathon-analytics')}
              className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
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
              color="green"
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
              color="yellow"
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
              color="red"
            />
          </>
        )}

        {/* Time Sections for All Users */}
        {user?.role !== 'Admin' && user?.role !== 'Organization' && (
          <>
            {/* Current Hackathons */}
            {currentHackathons.length > 0 && (
              <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <div className="bg-red-100 p-3 rounded-full mr-4">
                      <RiLiveFill className="text-red-500 text-2xl animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Live Now</h2>
                      <p className="text-gray-600">Events happening right now</p>
                    </div>
                  </div>
                  <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-bold animate-pulse">
                    Happening Now
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {currentHackathons.map(hackathon => (
                    <HackathonCard 
                      key={hackathon?._id} 
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
                <div className="flex items-center mb-8">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaRegClock className="text-blue-500 text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Coming Soon</h2>
                    <p className="text-gray-600">Upcoming events to register for</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {upcomingHackathons.map(hackathon => (
                    <HackathonCard 
                      key={hackathon?._id} 
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
                <div className="flex items-center mb-8">
                  <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <FaTrophy className="text-yellow-500 text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">Past Events</h2>
                    <p className="text-gray-600">Completed hackathons and results</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {pastHackathons.map(hackathon => (
                    <HackathonCard 
                      key={hackathon?._id} 
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
          <div className="text-center py-20">
            <div className="mx-auto h-32 w-32 text-gray-300 mb-8">
              <FaCode className="w-full h-full" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {user?.role === 'Organization'
                ? "You haven't organized any hackathons yet"
                : "No hackathons available"}
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              {user?.role === 'Organization'
                ? "Create your first hackathon to get started"
                : "Check back later for upcoming events"}
            </p>
            {user?.role === 'Organization' && (
              <button
                onClick={() => navigate('/create-hackathon')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
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

const StatusSection = ({ 
  title, 
  icon, 
  hackathons, 
  navigate, 
  badgeType, 
  emptyMessage, 
  userRole,
  onStatusUpdate,
  updatingId,
  color = 'gray'
}) => {
  const colorClasses = {
    green: 'bg-green-100',
    yellow: 'bg-yellow-100', 
    red: 'bg-red-100',
    gray: 'bg-gray-100'
  };

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className={`${colorClasses[color]} p-3 rounded-full mr-4`}>
            {icon}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">Manage hackathon approvals</p>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-gray-800 font-medium shadow-sm border">
          {hackathons.length} events
        </div>
      </div>
      
      {hackathons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {hackathons.map(hackathon => (
            <HackathonCard 
              key={hackathon?._id} 
              hackathon={hackathon} 
              navigate={navigate}
              badge={badgeType}
              userRole={userRole}
              onStatusUpdate={onStatusUpdate}
              isUpdating={updatingId === hackathon?._id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
          <p className="text-gray-500 text-lg">{emptyMessage}</p>
        </div>
      )}
    </section>
  );
};

const HackathonCard = ({ 
  hackathon, 
  navigate, 
  badge, 
  userRole,
  onStatusUpdate,
  isUpdating
}) => {
  const now = new Date();
  const isLive = new Date(hackathon?.startDate) <= now && new Date(hackathon?.endDate) >= now;
  const isPast = new Date(hackathon?.endDate) < now;

  // Determine gradient based on status or time
  let gradientClass = "";
  switch (hackathon?.status) {
    case 'Pending':
      gradientClass = "bg-gradient-to-r from-yellow-500 to-orange-500";
      break;
    case 'Rejected':
      gradientClass = "bg-gradient-to-r from-red-500 to-rose-600";
      break;
    default:
      if (isPast) {
        gradientClass = "bg-gradient-to-r from-gray-500 to-slate-600";
      } else if (isLive) {
        gradientClass = "bg-gradient-to-r from-red-500 to-pink-600";
      } else {
        gradientClass = "bg-gradient-to-r from-blue-500 to-purple-600";
      }
  }

  return (
    <div
      onClick={() => navigate(`/hackathons/${hackathon?._id}`)}
      className={`bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group relative border border-white/20 hover:scale-105 ${
        isPast ? "opacity-90 hover:opacity-100" : ""
      }`}
    >
      {/* Enhanced badges */}
      {badge === "live" && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-xs font-bold animate-pulse shadow-lg">
          🔴 LIVE
        </div>
      )}
      {badge === "upcoming" && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
          🚀 COMING SOON
        </div>
      )}
      {badge === "past" && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-gray-500 to-slate-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
          ✅ COMPLETED
        </div>
      )}
      {badge === "pending" && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
          ⏰ PENDING
        </div>
      )}
      {badge === "rejected" && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
          ❌ REJECTED
        </div>
      )}

      {/* Enhanced admin approval buttons */}
      {userRole === 'Admin' && hackathon?.status === 'Pending' && (
        <div className="absolute bottom-20 right-4 flex gap-2 z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onStatusUpdate && onStatusUpdate(hackathon?._id, 'Approved');
            }}
            disabled={isUpdating}
            className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs hover:shadow-lg disabled:opacity-50 flex items-center transition-all duration-200 font-medium"
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
              e.stopPropagation();
              onStatusUpdate && onStatusUpdate(hackathon?._id, 'Rejected');
            }}
            disabled={isUpdating}
            className="px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-lg text-xs hover:shadow-lg disabled:opacity-50 flex items-center transition-all duration-200 font-medium"
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

      {/* Enhanced header */}
      <div className={`p-6 ${gradientClass} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <h2 className="text-xl font-bold text-white truncate relative z-10">{hackathon?.title}</h2>
        <p className="text-white/90 text-sm mt-1 relative z-10">
          {hackathon?.organizer?.name || 'Unknown Organizer'}
        </p>
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full"></div>
      </div>

      {/* Enhanced content */}
      <div className="p-6">
        <p className="text-gray-700 mb-6 line-clamp-2 leading-relaxed">
          {hackathon?.description || "A hackathon focused on building innovative tech solutions"}
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-gray-600">
            <div className="bg-blue-50 p-2 rounded-lg mr-3">
              <FaCalendarAlt className="text-blue-500 text-sm" />
            </div>
            <span className="text-sm">
              {new Date(hackathon?.startDate).toLocaleDateString()} -{" "}
              {new Date(hackathon?.endDate).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <div className="bg-green-50 p-2 rounded-lg mr-3">
              <FaMapMarkerAlt className="text-green-500 text-sm" />
            </div>
            <span className="text-sm">{hackathon?.location || "Virtual"}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <div className="bg-purple-50 p-2 rounded-lg mr-3">
              <MdComputer className="text-purple-500 text-sm" />
            </div>
            <span className="text-sm">{hackathon?.mode || "Hybrid"} Event</span>
          </div>

          <div className="flex items-center text-gray-600">
            <div className="bg-orange-50 p-2 rounded-lg mr-3">
              <FaUsers className="text-orange-500 text-sm" />
            </div>
            <span className="text-sm">
              Teams: {hackathon?.minTeamSize || 1}-{hackathon?.maxTeamSize || 5} members
            </span>
          </div>
        </div>

        {hackathon?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {hackathon.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  hackathon?.status === 'Rejected' || isPast
                    ? "bg-gray-100 text-gray-600"
                    : "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-100"
                }`}
              >
                {tag}
              </span>
            ))}
            {hackathon.tags.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                +{hackathon.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Enhanced footer */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center text-sm text-gray-600">
          <FaUsers className="mr-2 text-blue-500" />
          <span className="font-medium">{hackathon?.teams?.length || 0} teams registered</span>
        </div>
        <button className={`text-sm font-semibold group-hover:underline transition-colors flex items-center ${
          hackathon?.status === 'Rejected' || isPast 
            ? "text-gray-500" 
            : "text-blue-600 hover:text-blue-800"
        }`}>
          View Details 
          <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
};

export default AllHackathons;