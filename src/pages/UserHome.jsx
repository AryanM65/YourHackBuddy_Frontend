import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { useTeam } from "../contexts/TeamContext";
import { useHackathon } from "../contexts/HackathonContext";
import { 
  FiAward, 
  FiClock, 
  FiMapPin, 
  FiBell, 
  FiChevronRight, 
  FiChevronLeft, 
  FiUsers, 
  FiCalendar,
  FiTrendingUp,
  FiZap,
  FiGlobe,
  FiStar,
  FiTarget,
  FiArrowRight
} from "react-icons/fi";
import axios from "axios";

const UserHome = () => {
  const { user } = useUser();
  const { getUserTeams } = useTeam();
  const { hackathons: allHackathons, fetchAllHackathons } = useHackathon();
  const [userTeams, setUserTeams] = useState([]);
  const [ongoingHackathons, setOngoingHackathons] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [loading, setLoading] = useState({
    teams: true,
    hackathons: true,
    announcements: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading({ teams: true, hackathons: true, announcements: true });
        
        // Fetch all data in parallel
        const [teamsData, announcementsData] = await Promise.all([
          getUserTeams(user._id),
          axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/get-announcements`, {
            withCredentials: true
          }).then(res => res.data.data)
        ]);

        // Get ongoing hackathons from the hackathon context
        await fetchAllHackathons();
        const ongoing = allHackathons.filter(hackathon => {
          const now = new Date();
          const start = new Date(hackathon.startDate);
          const end = new Date(hackathon.endDate);
          return now >= start && now <= end;
        });

        setUserTeams(teamsData);
        setOngoingHackathons(ongoing);
        setAnnouncements(announcementsData);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load some data. Please refresh to try again.");
      } finally {
        setLoading({
          teams: false,
          hackathons: false,
          announcements: false
        });
      }
    };
    
    fetchData();
  }, [user]);

  // Auto-rotate announcements
  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentAnnouncementIndex((prev) => 
          prev === announcements.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  const nextAnnouncement = () => {
    setCurrentAnnouncementIndex((prev) => 
      prev === announcements.length - 1 ? 0 : prev + 1
    );
  };

  const prevAnnouncement = () => {
    setCurrentAnnouncementIndex((prev) => 
      prev === 0 ? announcements.length - 1 : prev - 1
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <br></br>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%239C92AC\\' fill-opacity=\\'0.03\\'%3E%3Ccircle cx=\\'30\\' cy=\\'30\\' r=\\'1\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <p className="text-purple-300 text-lg mb-2 tracking-wide">{getGreeting()}</p>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 leading-tight">
                {user?.name?.split(' ')[0] || 'Developer'}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
                {!loading.teams && userTeams.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-2">
                      <FiUsers size={16} />
                      <span>{userTeams.length} Active Team{userTeams.length !== 1 ? 's' : ''}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex justify-center space-x-8 mb-8">
              {[
                { icon: FiTrendingUp, label: "Growing", value: "Fast" },
                { icon: FiZap, label: "Energy", value: "High" },
                { icon: FiTarget, label: "Focus", value: "Sharp" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center mb-2 mx-auto backdrop-blur-sm border border-white/10">
                    <stat.icon className="text-purple-300" size={20} />
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                  <div className="text-sm font-semibold text-white">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 backdrop-blur-sm p-4 mb-8 rounded-2xl">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs">!</span>
                </div>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* Enhanced Announcements */}
          {!loading.announcements && announcements.length > 0 && (
            <div className="mb-16">
              <div className="relative bg-gradient-to-r from-indigo-600/90 to-purple-600/90 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-sm border border-white/10">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl"></div>
                
                <div className="relative p-8 md:p-12">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mr-4">
                        <FiBell className="text-yellow-300" size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Latest Updates</h2>
                        <p className="text-white/70">Stay in the loop with announcements</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative min-h-[140px] flex items-center">
                    {announcements.length > 1 && (
                      <button
                        onClick={prevAnnouncement}
                        className="absolute left-0 z-10 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
                      >
                        <FiChevronLeft size={20} className="text-white" />
                      </button>
                    )}
                    
                    <div className="flex-1 mx-16">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-4 leading-tight">
                          {announcements[currentAnnouncementIndex]?.title}
                        </h3>
                        <p className="text-white/90 text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
                          {announcements[currentAnnouncementIndex]?.message}
                        </p>
                        <div className="flex items-center justify-center space-x-6 text-sm">
                          <div className="flex items-center space-x-2 text-white/80">
                            <FiClock size={16} />
                            <span>{formatTimeAgo(announcements[currentAnnouncementIndex]?.createdAt)}</span>
                          </div>
                          {announcements[currentAnnouncementIndex]?.targetAudience !== "All" && (
                            <div className="flex items-center space-x-2 text-white/80">
                              <FiTarget size={16} />
                              <span>{announcements[currentAnnouncementIndex]?.targetAudience}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {announcements.length > 1 && (
                      <button
                        onClick={nextAnnouncement}
                        className="absolute right-0 z-10 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 flex items-center justify-center backdrop-blur-sm"
                      >
                        <FiChevronRight size={20} className="text-white" />
                      </button>
                    )}
                  </div>
                  
                  {announcements.length > 1 && (
                    <div className="flex justify-center mt-8 space-x-3">
                      {announcements.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentAnnouncementIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentAnnouncementIndex 
                              ? 'bg-white scale-125' 
                              : 'bg-white/40 hover:bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16">
            {/* Browse Hackathons - Enhanced */}
            <div className="xl:col-span-1">
              <Link 
                to="/hackathons"
                className="group block h-full"
              >
                <div className="h-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:border-emerald-400/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <FiGlobe size={28} className="text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors">
                      Explore Hackathons
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      Discover cutting-edge challenges and connect with innovators worldwide
                    </p>
                    
                    <div className="flex items-center text-emerald-300 font-semibold group-hover:translate-x-2 transition-transform">
                      <span>Browse all</span>
                      <FiArrowRight className="ml-2 group-hover:ml-4 transition-all" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Live Hackathons */}
            <div className="xl:col-span-2">
              <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                      <FiZap className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Live Events</h2>
                      <p className="text-gray-400">Happening right now</p>
                    </div>
                  </div>
                  <Link 
                    to="/hackathons" 
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg"
                  >
                    <span>View all</span>
                    <FiChevronRight size={16} />
                  </Link>
                </div>
                
                {loading.hackathons ? (
                  <div className="flex justify-center py-16">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-pink-500 rounded-full animate-spin animation-delay-75"></div>
                    </div>
                  </div>
                ) : ongoingHackathons.length > 0 ? (
                  <div className="space-y-4">
                    {ongoingHackathons.slice(0, 3).map(hackathon => (
                      <Link
                        key={hackathon._id}
                        to={`/hackathons/${hackathon._id}`}
                        className="group block p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-purple-400/30 hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-6">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                              {hackathon.banner ? (
                                <img 
                                  src={hackathon.banner} 
                                  alt={hackathon.title}
                                  className="w-full h-full object-cover rounded-xl"
                                />
                              ) : (
                                <FiAward className="text-purple-300" size={24} />
                              )}
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">
                              {hackathon.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                              <div className="flex items-center space-x-2">
                                <FiClock size={14} />
                                <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FiMapPin size={14} />
                                <span>{hackathon.location} • {hackathon.mode}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-medium">
                                LIVE
                              </div>
                              <div className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                                Join Now
                              </div>
                            </div>
                          </div>
                          
                          <FiArrowRight className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-gray-500/20 to-gray-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiCalendar className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">No Live Events</h3>
                    <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                      Check back soon for exciting hackathons and competitions
                    </p>
                    <Link
                      to="/hackathons"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                    >
                      <span>Browse Upcoming</span>
                      <FiArrowRight size={16} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Teams Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                  <FiUsers className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Teams</h2>
                  <p className="text-gray-400">Collaborate and innovate together</p>
                </div>
              </div>
            </div>
            
            {loading.teams ? (
              <div className="flex justify-center py-16">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              </div>
            ) : userTeams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {userTeams.slice(0, 6).map(team => {
                  // Get hackathon ID - handle both object and string formats
                  const hackathonId = 
                    team.hackathonId?._id || 
                    (typeof team.hackathonId === 'string' ? team.hackathonId : null);
                  
                  return (
                    <Link
                      key={team._id}
                      to={
                          `/hackathon/${team.hackathon._id}/your-team`
                      }
                      className="group block p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-400/30 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors leading-tight">
                          {team.name}
                        </h3>
                        {team.hackathonId && (
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            team.isRegistered 
                              ? "bg-green-500/20 text-green-300" 
                              : "bg-yellow-500/20 text-yellow-300"
                          }`}>
                            {team.isRegistered ? "Active" : "Draft"}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2 text-gray-400">
                          <FiUsers size={16} />
                          <span>{team.members?.length || 0} member{team.members?.length !== 1 ? 's' : ''}</span>
                        </div>
                        {team.hackathonId && (
                          <div className="flex items-center space-x-1">
                            <FiStar size={14} className="text-yellow-400" />
                            <span className="text-xs text-gray-400">Registered</span>
                          </div>
                        )}
                      </div>
                      
                      {team.hackathonId && (
                        <div className="text-sm text-gray-300 mb-4 p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FiTarget size={14} />
                            <span className="font-medium">Competing in: {team.hackathonId.name || "Hackathon"}</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FiClock size={12} />
                          <span>Created {formatDate(team.createdAt)}</span>
                        </div>
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiUsers className="text-blue-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Team Up?</h3>
                <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                  Great ideas come from great teams. Create your first team and start building something amazing together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/create-team"
                    className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold"
                  >
                    <FiUsers size={20} />
                    <span>Create Team</span>
                  </Link>
                  <Link
                    to="/teams"
                    className="inline-flex items-center justify-center space-x-2 bg-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/20 transition-all font-medium border border-white/20"
                  >
                    <span>Browse Teams</span>
                    <FiArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHome;