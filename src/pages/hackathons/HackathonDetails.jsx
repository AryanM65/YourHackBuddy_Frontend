import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useHackathon } from "../../contexts/HackathonContext";
import { useUser } from "../../contexts/UserContext";
import { 
  FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClipboardCheck,
  FaRegClock, FaTag, FaRegListAlt, FaShieldAlt, FaRegCalendarAlt, 
  FaCode, FaChartBar
} from "react-icons/fa";

const DetailItem = ({ icon, label, value, colSpan = "" }) => (
  <div className={`${colSpan} flex items-start gap-3`}>
    <div className="mt-1">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  </div>
);

const HackathonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedHackathon, fetchHackathonById, loading } = useHackathon();
  const { user } = useUser();

  useEffect(() => { 
    fetchHackathonById(id) 
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
    </div>
  );

  if (!selectedHackathon) return <div className="text-center py-20">Hackathon not found</div>;

  const { 
    title, description, startDate, endDate, registrationDeadline,
    location, mode, tags = [], maxTeamSize, minTeamSize, eligibility,
    rules = [], policies = [], timeline = [], banner 
  } = selectedHackathon;

  const bannerUrl = banner || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

  const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const isAdmin = user?.role === 'Admin';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Banner */}
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg h-80 relative">
          <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          {!banner && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <div className="text-center p-6">
                <FaCode className="mx-auto text-6xl text-white mb-4" />
                <h2 className="text-4xl font-bold text-white">{title}</h2>
              </div>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{title}</h1>
          <p className="text-xl text-gray-600">{description}</p>
        </div>

        {/* Actions - Conditionally rendered based on user role */}
        <div className="flex flex-wrap gap-4 mb-10">
          {!isAdmin && (
            <>
              <button
                onClick={() => navigate(`/hackathon/${id}/teams/create`)}
                className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <FaUsers /> Create Team
              </button>
              <button
                onClick={() => navigate(`/hackathon/${id}/your-team`)}
                className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <FaUsers /> Your Team
              </button>
            </>
          )}
          
          <button
            onClick={() => navigate(`/hackathon/${id}/teams`)}
            className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg hover:from-green-700 hover:to-teal-600 transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <FaUsers /> View Teams
          </button>
          
          {isAdmin && (
            <button
              onClick={() => navigate(`/hackathons/${id}/analytics/teams`)}
              className="flex-1 min-w-[200px] px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-500 text-white rounded-lg hover:from-indigo-700 hover:to-violet-600 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <FaChartBar /> Team Analytics
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <FaClipboardCheck className="text-blue-500" /> Event Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem icon={<FaCalendarAlt className="text-purple-500" />} label="Start Date" value={formatDate(startDate)} />
                <DetailItem icon={<FaCalendarAlt className="text-purple-500" />} label="End Date" value={formatDate(endDate)} />
                <DetailItem icon={<FaRegClock className="text-orange-500" />} label="Registration Deadline" value={formatDate(registrationDeadline)} />
                <DetailItem icon={<FaMapMarkerAlt className="text-red-500" />} label="Location" value={location} />
                <DetailItem icon={<ComputerIcon className="text-blue-500" />} label="Mode" value={mode} />
                <DetailItem icon={<FaUsers className="text-green-500" />} label="Team Size" value={`${minTeamSize}-${maxTeamSize} members`} />
                <DetailItem icon={<FaShieldAlt className="text-yellow-500" />} label="Eligibility" value={eligibility} colSpan="md:col-span-2" />
              </div>
            </div>

            {/* Timeline */}
            {timeline.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <FaRegCalendarAlt className="text-blue-500" /> Event Timeline
                </h2>
                <div className="space-y-4">
                  {timeline.map((item, i) => (
                    <div key={i} className="flex group">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-1" />
                        {i < timeline.length - 1 && <div className="w-0.5 h-full bg-gradient-to-b from-purple-200 to-pink-200" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="p-4 bg-gray-50 rounded-lg group-hover:bg-purple-50 transition-colors">
                          <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
                          <p className="text-sm text-purple-600 mb-2">{formatDate(item.date)}</p>
                          <p className="text-gray-600">{item.description}</p>
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
              ['Tags', FaTag, tags],
              ['Rules', FaRegListAlt, rules],
              ['Policies', FaShieldAlt, policies]
            ].map(([title, Icon, items]) => items.length > 0 && (
              <div key={title} className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <Icon className="text-blue-500" /> {title}
                </h2>
                {title === 'Tags' ? (
                  <div className="flex flex-wrap gap-2">
                    {items.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-sm font-medium rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span className="text-gray-700">{item}</span>
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
  );
};

const ComputerIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
  </svg>
);

export default HackathonDetails;