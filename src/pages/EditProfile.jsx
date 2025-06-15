import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { 
  FaUser, FaEnvelope, FaPen, FaCode, 
  FaLinkedin, FaGithub, FaSave, 
  FaSpinner, FaInfoCircle, FaPlus, FaTimes
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, loading, updateProfile } = useUser();
  const [formData, setFormData] = useState({ 
    bio: "", 
    skills: [], 
    linkedin: "", 
    github: "" 
  });
  const [currentSkill, setCurrentSkill] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setFormData({
      bio: user.bio || "",
      skills: user.skills || [],
      linkedin: user.linkedin || "",
      github: user.github || ""
    });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await updateProfile(formData);
      setMessage({ text: "Profile updated successfully!", isError: false });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      setMessage({ text: "Failed to update profile. Please try again.", isError: true });
    } finally {
      setIsUpdating(false);
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, currentSkill.trim()]
      });
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );
  
  if (!user) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <FaInfoCircle className="text-yellow-500 text-4xl mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
      <p className="text-gray-300 max-w-md">
        Please log in to access your profile settings
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-purple-500/30 shadow-xl overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-purple-600 to-pink-500">
          <div className="bg-gray-900 p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg">
                <FaPen className="text-white text-xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Edit Profile
                </h2>
                <p className="text-gray-400">Customize your public information</p>
              </div>
            </div>
            
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg border ${
                message.isError 
                  ? 'bg-red-900/30 border-red-700 text-red-300' 
                  : 'bg-green-900/30 border-green-700 text-green-300'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <h3 className="font-medium text-gray-300 mb-4 flex items-center gap-2">
                    <FaUser className="text-purple-400" />
                    Personal Info
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Full Name</label>
                      <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                        <FaUser className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-300 truncate">
                          {user.name || "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Email</label>
                      <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600/50">
                        <FaEnvelope className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-300 truncate">
                          {user.email || "Not provided"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                  <h3 className="font-medium text-gray-300 mb-4 flex items-center gap-2">
                    <FaCode className="text-purple-400" />
                    Professional Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        className="w-full p-3 bg-gray-700/50 rounded-lg border border-gray-600/50 text-gray-300 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                        placeholder="Tell others about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Skills</label>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.skills.map((skill, index) => (
                          <div 
                            key={index} 
                            className="flex items-center gap-1 bg-purple-600/30 px-3 py-1 rounded-full text-sm text-purple-100"
                          >
                            {skill}
                            <button 
                              type="button" 
                              onClick={() => removeSkill(skill)}
                              className="ml-1 text-gray-300 hover:text-white"
                            >
                              <FaTimes className="text-xs" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <FaCode />
                          </div>
                          <input
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="JavaScript, React, Node.js"
                            className="w-full pl-10 pr-3 py-3 bg-gray-700/50 rounded-lg border border-gray-600/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addSkill}
                          className="px-4 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center transition"
                        >
                          <FaPlus className="text-white" />
                        </button>
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-1">
                        Type a skill and press Enter, comma, or the + button to add
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <h3 className="font-medium text-gray-300 mb-4 flex items-center gap-2">
                  <FaLinkedin className="text-blue-400" />
                  Social Profiles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">LinkedIn</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <FaLinkedin />
                      </div>
                      <input
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full pl-10 pr-3 py-3 bg-gray-700/50 rounded-lg border border-gray-600/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">GitHub</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <FaGithub />
                      </div>
                      <input
                        name="github"
                        value={formData.github}
                        onChange={(e) => setFormData({...formData, github: e.target.value})}
                        placeholder="https://github.com/username"
                        className="w-full pl-10 pr-3 py-3 bg-gray-700/50 rounded-lg border border-gray-600/50 text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-purple-500/30 disabled:opacity-70"
                >
                  {isUpdating ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;