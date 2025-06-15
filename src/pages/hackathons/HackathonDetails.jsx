import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useHackathon } from "../../contexts/HackathonContext";
import { useUser } from "../../contexts/UserContext";
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClipboardCheck,
  FaRegClock, FaTag, FaRegListAlt, FaShieldAlt, FaRegCalendarAlt, 
  FaCode, FaChartBar, FaBuilding, FaUser, FaGlobe, FaEnvelope
} from "react-icons/fa";

const DetailItem = ({ icon, label, value, colSpan = "" }) => (
  <div className={`${colSpan} group`}>
    <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg group-hover:from-purple-200 group-hover:to-blue-200 transition-all duration-300">
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-gray-800 font-medium leading-relaxed">{value}</p>
        </div>
      </div>
    </div>
  </div>
);

const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedHackathon, fetchHackathonById, loading } = useHackathon();
  const { user } = useUser();
  
  const [hasTeam, setHasTeam] = useState(false);
  const [checkingTeam, setCheckingTeam] = useState(true);
  
  useEffect(() => { 
    fetchHackathonById(id);
  }, [id]);

  useEffect(() => {
    const checkUserTeam = async () => {
      if (!user) {
        setCheckingTeam(false);
        return;
      }
      
      try {
        console.log("hackathonId", id);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/your-team`,
          { hackathonId: id },
          { withCredentials: true } // Send cookies automatically
        );
        console.log("response", response);

        if (response.data.team) {
          setHasTeam(true);
        } else {
          setHasTeam(false);
        }
      } catch (error) {
        console.log("error", error);
        if (error.response && error.response.status === 404) {
          // User doesn't have a team for this hackathon
          setHasTeam(false);
        } else {
          console.error('Error checking team:', error);
          setHasTeam(false);
        }
      } finally {
        setCheckingTeam(false);
      }
    };

    if (id) {
      checkUserTeam();
    }
  }, [id, user]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex justify-center items-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200" />
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 absolute top-0 left-0" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading hackathon details...</p>
      </div>
    </div>
  );

  if (!selectedHackathon) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex justify-center items-center">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <FaCode className="text-4xl text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Hackathon Not Found</h2>
        <p className="text-gray-600">The hackathon you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  const { 
    title, description, startDate, endDate, registrationDeadline,
    location, mode, tags = [], maxTeamSize, minTeamSize, eligibility,
    rules = [], policies = [], timeline = [], banner, organizer, organizerModel
  } = selectedHackathon;

  const bannerUrl = banner || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const isAdmin = user?.role === 'Admin';
  const isOrganization = user?.role === 'Organization';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(139, 92, 246, 0.1) 2px, transparent 0), 
                           radial-gradient(circle at 75px 75px, rgba(59, 130, 246, 0.1) 2px, transparent 0)`,
          backgroundSize: '100px 100px'
        }} />
      </div>
      
      <div className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Banner */}
          <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl h-96 relative group">
            <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {!banner && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-700 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                    <FaCode className="relative mx-auto text-8xl text-white drop-shadow-lg" />
                  </div>
                  <h2 className="text-5xl font-bold text-white drop-shadow-lg">{title}</h2>
                </div>
              </div>
            )}
            {/* Floating Badge */}
            <div className="absolute top-6 right-6">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-semibold text-purple-600">Live Event</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              {description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {!isAdmin && !isOrganization && (
              <>
                {/* Create Team Button - only shown if user doesn't have a team */}
                {!hasTeam && !checkingTeam && (
                  <button
                    onClick={() => navigate(`/hackathon/${id}/teams/create`)}
                    className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 font-semibold"
                  >
                    <FaUsers className="group-hover:scale-110 transition-transform" /> 
                    Create Team
                  </button>
                )}
                
                {/* Your Team Button - only shown if user has a team */}
                  <button
                    onClick={() => navigate(`/hackathon/${id}/your-team`)}
                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 font-semibold"
                  >
                    <FaUsers className="group-hover:scale-110 transition-transform" /> 
                    Your Team
                  </button>
                
                {/* Loading state while checking team status */}
                {checkingTeam && (
                  <button
                    disabled
                    className="group px-8 py-4 bg-gray-400 text-white rounded-xl transition-all duration-300 shadow-lg flex items-center gap-3 font-semibold cursor-not-allowed"
                  >
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Checking team...
                  </button>
                )}
              </>
            )}
            
            {/* View Teams Button - always shown */}
            <button
              onClick={() => navigate(`/hackathon/${id}/teams`)}
              className="group px-8 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 font-semibold"
            >
              <FaUsers className="group-hover:scale-110 transition-transform" /> 
              View Teams
            </button>
            
            {/* Team Analytics Button - only for admins */}
            {isAdmin && (
              <button
                onClick={() => navigate(`/hackathons/${id}/analytics/teams`)}
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 font-semibold"
              >
                <FaChartBar className="group-hover:scale-110 transition-transform" /> 
                Team Analytics
              </button>
            )}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3 space-y-8">
              {/* Details Card */}
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                    <FaClipboardCheck className="text-2xl text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Event Details</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DetailItem icon={<FaCalendarAlt className="text-purple-500 text-lg" />} label="Start Date" value={formatDate(startDate)} />
                  <DetailItem icon={<FaCalendarAlt className="text-purple-500 text-lg" />} label="End Date" value={formatDate(endDate)} />
                  <DetailItem icon={<FaRegClock className="text-orange-500 text-lg" />} label="Registration Deadline" value={formatDate(registrationDeadline)} />
                  <DetailItem icon={<FaMapMarkerAlt className="text-red-500 text-lg" />} label="Location" value={location} />
                  <DetailItem icon={<ComputerIcon className="text-blue-500 text-lg" />} label="Mode" value={mode} />
                  <DetailItem icon={<FaUsers className="text-green-500 text-lg" />} label="Team Size" value={`${minTeamSize}-${maxTeamSize} members`} />
                  <DetailItem icon={<FaShieldAlt className="text-yellow-500 text-lg" />} label="Eligibility" value={eligibility} colSpan="lg:col-span-2" />
                </div>
              </div>

              {/* Organizer Card */}
              {organizer && (
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                      {organizerModel === 'Organization' ? (
                        <FaBuilding className="text-2xl text-emerald-600" />
                      ) : (
                        <FaUser className="text-2xl text-emerald-600" />
                      )}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      Organized by {organizerModel === 'Organization' ? 'Organization' : 'Individual'}
                    </h2>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100">
                    <div className="flex items-start gap-6">
                      {/* Logo/Avatar */}
                      <div className="flex-shrink-0">
                        {organizerModel === 'Organization' && organizer.logo ? (
                          <img 
                            src={organizer.logo} 
                            alt={`${organizer.name} logo`}
                            className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                            {organizerModel === 'Organization' ? (
                              <FaBuilding className="text-2xl text-white" />
                            ) : (
                              <FaUser className="text-2xl text-white" />
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Organizer Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {organizer.name}
                        </h3>
                        
                        {organizer.description && (
                          <p className="text-gray-600 leading-relaxed mb-4">{organizer.description}</p>
                        )}
                        
                        {organizerModel === 'Organization' && organizer.type && (
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mb-3">
                            <FaTag className="text-emerald-600 text-sm" />
                            <span className="text-sm font-semibold text-emerald-700">{organizer.type}</span>
                          </div>
                        )}
                        
                        {/* Contact Info */}
                        <div className="flex flex-wrap gap-4 mt-4">
                          {organizer.email && (
                            <a 
                              href={`mailto:${organizer.email}`}
                              className="group flex items-center gap-2 px-4 py-2 bg-white/80 rounded-lg border border-emerald-200 hover:border-emerald-300 hover:bg-white transition-all duration-300"
                            >
                              <FaEnvelope className="text-emerald-600 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-medium text-gray-700">{organizer.email}</span>
                            </a>
                          )}
                          
                          {organizer.website && (
                            <a 
                              href={organizer.website.startsWith('http') ? organizer.website : `https://${organizer.website}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="group flex items-center gap-2 px-4 py-2 bg-white/80 rounded-lg border border-emerald-200 hover:border-emerald-300 hover:bg-white transition-all duration-300"
                            >
                              <FaGlobe className="text-emerald-600 group-hover:scale-110 transition-transform" />
                              <span className="text-sm font-medium text-gray-700">Visit Website</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              {timeline.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                      <FaRegCalendarAlt className="text-2xl text-blue-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Event Timeline</h2>
                  </div>
                  <div className="space-y-6">
                    {timeline.map((item, i) => (
                      <div key={i} className="flex group">
                        <div className="flex flex-col items-center mr-6">
                          <div className="relative">
                            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg" />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-ping opacity-20" />
                          </div>
                          {i < timeline.length - 1 && <div className="w-1 h-full bg-gradient-to-b from-purple-300 to-pink-300 mt-2 rounded-full" />}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 group-hover:border-purple-200 group-hover:shadow-lg transition-all duration-300">
                            <h3 className="font-bold text-xl text-gray-800 mb-2">{item.title}</h3>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-3">
                              <FaRegClock className="text-purple-600 text-sm" />
                              <p className="text-sm font-semibold text-purple-700">{formatDate(item.date)}</p>
                            </div>
                            <p className="text-gray-600 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {[
                ['Tags', FaTag, tags, 'from-pink-100 to-purple-100', 'pink-600'],
                ['Rules', FaRegListAlt, rules, 'from-blue-100 to-indigo-100', 'blue-600'],
                ['Policies', FaShieldAlt, policies, 'from-green-100 to-teal-100', 'green-600']
              ].map(([title, Icon, items, bgGradient, iconColor]) => items.length > 0 && (
                <div key={title} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-2 bg-gradient-to-br ${bgGradient} rounded-lg`}>
                      <Icon className={`text-lg text-${iconColor}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                  </div>
                  {title === 'Tags' ? (
                    <div className="flex flex-wrap gap-2">
                      {items.map((tag, i) => (
                        <span key={i} className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-semibold rounded-full border border-purple-200 hover:from-purple-200 hover:to-pink-200 transition-all duration-300 cursor-default">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start group">
                          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2 mr-3 group-hover:scale-125 transition-transform" />
                          <span className="text-gray-700 leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComputerIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
  </svg>
);

export default HackathonDetails;