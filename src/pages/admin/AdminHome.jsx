import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { 
  FiBell, 
  FiChevronRight, 
  FiChevronLeft, 
  FiArrowRight,
  FiCalendar,
  FiUsers,
  FiCode,
  FiSettings,
  FiAward,
  FiBarChart2,
  FiShield,
  FiAlertTriangle,
  FiMessageSquare,
  FiPieChart,
  FiTrendingUp
} from "react-icons/fi";
import axios from "axios";

const AdminHome = () => {
  const { user } = useUser();
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [loading, setLoading] = useState({
    announcements: true
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading({ announcements: true });
        
        const announcementsData = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/v1/get-announcements`, {
          withCredentials: true
        }).then(res => res.data.data);

        setAnnouncements(announcementsData);
      } catch (err) {
        console.error("Failed to load admin data:", err);
        setError("Failed to load announcements. Please refresh to try again.");
      } finally {
        setLoading({ announcements: false });
      }
    };
    
    fetchData();
  }, [user]);

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

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return new Date(dateString).toLocaleDateString();
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

  // Utility cards data
  const utilityCards = [
    {
      title: "Manage Hackathons",
      description: "Create, edit and manage hackathon events",
      icon: <FiCode className="text-purple-400" size={24} />,
      bg: "from-purple-600/20 to-purple-800/20",
      //link: "/dashboard/hackathons"
    },
    {
      title: "User Management",
      description: "View and manage all user accounts",
      icon: <FiUsers className="text-blue-400" size={24} />,
      bg: "from-blue-600/20 to-blue-800/20",
      //link: "/dashboard/users"
    },
    {
      title: "Hackathon Analytics",
      description: "View detailed hackathon statistics",
      icon: <FiTrendingUp className="text-emerald-400" size={24} />,
      bg: "from-emerald-600/20 to-emerald-800/20",
      //link: "/admin/all-hackathon-analytics"
    },
    {
      title: "Admin Settings",
      description: "Configure platform settings",
      icon: <FiSettings className="text-amber-400" size={24} />,
      bg: "from-amber-600/20 to-amber-800/20",
      //link: "/dashboard/settings"
    },
    {
      title: "View Complaints",
      description: "Review and resolve user complaints",
      icon: <FiAlertTriangle className="text-pink-400" size={24} />,
      bg: "from-pink-600/20 to-pink-800/20",
      //link: "/admin/view-complaints"
    },
    {
      title: "Add Announcement",
      description: "Create new platform announcements",
      icon: <FiMessageSquare className="text-cyan-400" size={24} />,
      bg: "from-cyan-600/20 to-cyan-800/20",
      //link: "/admin/add-announcement"
    }
  ];

  // Quick action buttons (shown below the main View Dashboard button)
  const quickActions = [
    {
      name: "View Complaints",
      link: "/view-complaints",
      icon: <FiAlertTriangle size={18} />
    },
    {
      name: "Add Announcement",
      link: "/admin/add-announcement",
      icon: <FiMessageSquare size={18} />
    },
    {
      name: "Hackathon Analytics",
      link: "/all-hackathon-analytics",
      icon: <FiTrendingUp size={18} />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <br></br>
      <br></br>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%239C92AC\\' fill-opacity=\\'0.03\\'%3E%3Ccircle cx=\\'30\\' cy=\\'30\\' r=\\'1\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 p-6 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-6">
              <p className="text-purple-300 text-lg mb-2 tracking-wide">{getGreeting()}, Admin</p>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 leading-tight">
                {user?.name?.split(' ')[0] || 'Admin'}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Admin Dashboard</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-4">
              <Link 
                to="/dashboard"
                className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold text-lg"
              >
                <span>View Dashboard</span>
                <FiArrowRight size={20} />
              </Link>
              
              <div className="flex flex-wrap justify-center gap-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    {action.icon}
                    <span>{action.name}</span>
                  </Link>
                ))}
              </div>
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

          {/* Utility Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {utilityCards.map((card, index) => (
              <Link 
                key={index}
                to={card.link}
                className={`bg-gradient-to-br ${card.bg} border border-white/10 rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
                    <p className="text-white/70">{card.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

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
                    <Link 
                      to="/admin/add-announcement"
                      className="hidden md:flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
                    >
                      <FiMessageSquare size={18} />
                      <span>Create Announcement</span>
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
                            <FiCalendar size={16} />
                            <span>{formatTimeAgo(announcements[currentAnnouncementIndex]?.createdAt)}</span>
                          </div>
                          {announcements[currentAnnouncementIndex]?.targetAudience !== "All" && (
                            <div className="flex items-center space-x-2 text-white/80">
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
        </div>
      </div>
    </div>
  );
};

export default AdminHome;