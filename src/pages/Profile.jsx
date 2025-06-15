import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  FaSpinner, 
  FaUserAlt, 
  FaEnvelope, 
  FaUserTag, 
  FaCalendarAlt,
  FaArrowLeft,
  FaExclamationTriangle,
  FaGithub,
  FaLinkedin,
  FaCode,
  FaTrophy,
  FaCalendarDay,
  FaUsers
} from 'react-icons/fa';

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/profile/${userId}`
        );
        
        if (response.status >= 200 && response.status < 300) {
          // Using response.data as the source for all profile data
          console.log("data", response.data.data);
          setProfile(response.data.data);
          setError(null);
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      } catch (err) {
        let errorMessage = 'Failed to fetch profile';
        
        if (err.response) {
          errorMessage = err.response.data?.message || 
                        `Server error: ${err.response.status}`;
        } else if (err.request) {
          errorMessage = 'No response from server';
        } else {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <FaSpinner className="animate-spin text-4xl text-purple-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4">
        <div className="text-center max-w-lg p-8 bg-gray-800 rounded-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 mb-4">
            <FaExclamationTriangle className="text-red-400 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-red-400 mb-2">Profile Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
            >
              Try Again
            </button>
            <Link
              to="/"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-center transition"
            >
              Go Home
            </Link>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            User ID: {userId}
          </p>
        </div>
      </div>
    );
  }

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <br></br>
        <br></br>
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/hackathons" 
          className="mb-6 inline-flex items-center text-purple-400 hover:text-purple-300 group"
        >
          <FaArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" /> 
          <span>Back</span>
        </Link>
        
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-900 to-indigo-800 p-8 text-center relative">
            <div className="w-32 h-32 mx-auto bg-gray-200 border-4 border-white rounded-full overflow-hidden flex items-center justify-center shadow-lg">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={`${profile.name}'s avatar`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserAlt className="text-gray-400 text-6xl" />
              )}
            </div>
            <h1 className="mt-4 text-3xl font-bold text-white">
              {profile?.name || 'No Name Provided'}
            </h1>
            <div className="mt-2 inline-flex items-center px-4 py-2 bg-indigo-600/30 rounded-full text-indigo-100 backdrop-blur-sm">
              <FaUserTag className="mr-2" />
              <span className="font-medium">{profile?.role || 'No Role'}</span>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-purple-500/10"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 rounded-full bg-indigo-500/10"></div>
            </div>
          </div>
          
          {/* Profile Details */}
          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem 
                icon={<FaEnvelope />}
                label="Email"
                value={profile?.email || 'No email provided'}
              />
              
              <DetailItem 
                icon={<FaCalendarAlt />}
                label="Member Since"
                value={profile?.createdAt 
                  ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : 'Unknown date'}
              />
              
              {/* Social Links */}
              {(profile?.github || profile?.linkedin) && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Social Links</h3>
                  <div className="flex flex-wrap gap-4">
                    {profile?.github && (
                      <a 
                        href={profile.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <FaGithub className="text-xl text-gray-300" />
                        <span className="text-purple-400 hover:text-purple-300">
                          GitHub Profile
                        </span>
                      </a>
                    )}
                    
                    {profile?.linkedin && (
                      <a 
                        href={profile.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        <FaLinkedin className="text-xl text-blue-400" />
                        <span className="text-purple-400 hover:text-purple-300">
                          LinkedIn Profile
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              {/* Skills Section */}
              {profile?.skills?.length > 0 && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center gap-2">
                    <FaCode className="text-purple-400" /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-2 bg-purple-900/30 text-purple-300 rounded-lg text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Bio Section */}
              {profile?.bio && (
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">About</h3>
                  <p className="text-gray-400 bg-gray-700/30 rounded-lg p-4 whitespace-pre-line">
                    {profile.bio}
                  </p>
                </div>
              )}
              
              {/* Hackathons Section */}
              {profile?.hackathonsParticipated?.length > 0 && (
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-600/20 rounded-lg">
                      <FaTrophy className="text-purple-400 text-xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-200">Hackathons Participated</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.hackathonsParticipated.map((hackathon) => (
                      <div 
                        key={hackathon._id} 
                        className="bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-colors border border-gray-600/50"
                      >
                        <h4 className="font-semibold text-lg text-purple-300 mb-2">{hackathon.title}</h4>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <FaCalendarDay className="text-purple-400" />
                          <span>
                            {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                          </span>
                        </div>
                        
                        {/* {hackathon.team && (
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
                            <FaUsers className="text-purple-400" />
                            <span>Team: {hackathon.team.name}</span>
                          </div>
                        )} */}
                        
                        <div className="mt-3 flex justify-between items-center">
                          <span className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded-full text-xs">
                            {hackathon.status}
                          </span>
                          
                          {/* {hackathon.result && (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              hackathon.result === 'Winner' 
                                ? 'bg-green-900/30 text-green-400' 
                                : 'bg-blue-900/30 text-blue-400'
                            }`}>
                              {hackathon.result}
                            </span>
                          )} */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable detail component
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start bg-gray-700/30 rounded-xl p-4 hover:bg-gray-700/50 transition-colors">
    <div className="flex-shrink-0 p-3 bg-purple-500/10 rounded-lg text-purple-400">
      {icon}
    </div>
    <div className="ml-4">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{label}</h3>
      <p className="mt-1 text-lg text-white break-words">{value}</p>
    </div>
  </div>
);

export default Profile;