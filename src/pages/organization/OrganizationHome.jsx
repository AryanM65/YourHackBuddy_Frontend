import { useState, useEffect } from 'react';
import { useHackathon } from "../../contexts/HackathonContext";
import { useUser } from "../../contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTrophy, 
  FaRegClock, FaPlus, FaCheck, FaClock, FaTimes,
  FaSpinner, FaCode, FaChartLine, FaArrowRight
} from "react-icons/fa";
import { MdComputer } from "react-icons/md";
import { RiLiveFill } from "react-icons/ri";
import { 
  FiAward, FiClock, FiMapPin, FiBell, 
  FiChevronRight, FiChevronLeft, FiUsers as FiUsersAlt,
  FiCalendar, FiTrendingUp, FiZap, FiGlobe, 
  FiStar, FiTarget, FiArrowRight as FiArrowRightAlt
} from "react-icons/fi";
import axios from "axios";

const OrganizationHome = () => {
  const { hackathons: allHackathons, loading: hackathonsLoading } = useHackathon();
  const { user } = useUser();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  // Filter hackathons for this organization that are live/current
  const currentHackathons = allHackathons.filter(hackathon => {
    const now = new Date();
    const start = new Date(hackathon.startDate);
    const end = new Date(hackathon.endDate);
    return (
      hackathon.organizerModel === "Organization" && 
      hackathon.organizer._id === user.organization._id &&
      now >= start && 
      now <= end
    );
  });

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoadingAnnouncements(true);
        const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/get-announcements`, {
          withCredentials: true
        });
        setAnnouncements(response.data.data);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    fetchAnnouncements();
  }, []);

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <br></br>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%239C92AC\\' fill-opacity=\\'0.03\\'%3E%3Ccircle cx=\\'30\\' cy=\\'30\\' r=\\'1\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <p className="text-purple-300 text-lg mb-2 tracking-wide">{getGreeting()}</p>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 leading-tight">
                {user?.name || 'Organization'}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Active</span>
                </div>
                {!hackathonsLoading && currentHackathons.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-2">
                      <FiZap size={16} />
                      <span>{currentHackathons.length} Live Hackathon{currentHackathons.length !== 1 ? 's' : ''}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/add-hackathon')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
              >
                <FaPlus className="mr-2" />
                Add a Hackathon
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium"
              >
                <FaChartLine className="mr-2" />
                Go to Dashboard
              </button>
            </div>
          </div>

          {/* Announcements Carousel */}
          {!loadingAnnouncements && announcements.length > 0 && (
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
                    <Link 
                      to="/announcements" 
                      className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm"
                    >
                      <span>View all</span>
                      <FiArrowRightAlt size={16} />
                    </Link>
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

          {/* Current Hackathons Section */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                  <RiLiveFill className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Your Live Hackathons</h2>
                  <p className="text-gray-400">Currently running events</p>
                </div>
              </div>
              <Link 
                to="/dashboard" 
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg"
              >
                <span>View all</span>
                <FiChevronRight size={16} />
              </Link>
            </div>
            
            {hackathonsLoading ? (
              <div className="flex justify-center py-16">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-pink-500 rounded-full animate-spin animation-delay-75"></div>
                </div>
              </div>
            ) : currentHackathons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentHackathons.map(hackathon => (
                  <div
                    key={hackathon._id}
                    onClick={() => navigate(`/hackathons/${hackathon._id}`)}
                    className="group block p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-purple-400/30 hover:bg-white/10 transition-all duration-300 cursor-pointer"
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
                            {hackathon.teams?.length || 0} teams
                          </div>
                        </div>
                      </div>
                      
                      <FaArrowRight className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-500/20 to-gray-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCalendar className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">No Live Hackathons</h3>
                <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                  Create a new hackathon to start engaging with participants
                </p>
                <button
                  onClick={() => navigate('/add-hackathon')}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                >
                  <FaPlus size={16} />
                  <span>Create Hackathon</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationHome;