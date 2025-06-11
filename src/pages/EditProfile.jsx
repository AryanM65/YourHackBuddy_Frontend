import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import { FaUser, FaEnvelope, FaPen, FaCode, FaLinkedin, FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, loading, updateProfile } = useUser();
  const [formData, setFormData] = useState({ bio: "", skills: "", linkedin: "", github: "" });
  const [message, setMessage] = useState({ text: "", isError: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setFormData({
      bio: user.bio || "",
      skills: user.skills?.join(", ") || "",
      linkedin: user.linkedin || "",
      github: user.github || ""
    });
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        ...formData,
        skills: formData.skills.split(",").map(skill => skill.trim()).filter(skill => skill)
      });
      setMessage({ text: "Profile updated successfully!", isError: false });
      navigate('/dashboard');
    } catch (error) {
      setMessage({ text: "Failed to update profile. Please try again.", isError: true });
    }
  };

  if (loading) return <div className="flex justify-center py-20">Loading...</div>;
  if (!user) return <div className="flex justify-center py-20">Please log in to edit profile</div>;

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-purple-500/20 shadow-lg mt-10">
      <div className="flex items-center gap-3 mb-6">
        <FaPen className="text-purple-400 text-xl" />
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Edit Profile
        </h2>
      </div>
      
      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${message.isError ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaUser />
          </div>
          <input
            value={user.name || ""}
            readOnly
            className="w-full pl-10 pr-3 py-2.5 bg-gray-700/50 rounded-lg border border-gray-600/50 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaEnvelope />
          </div>
          <input
            value={user.email || ""}
            readOnly
            className="w-full pl-10 pr-3 py-2.5 bg-gray-700/50 rounded-lg border border-gray-600/50 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full p-3 bg-gray-700/50 rounded-lg border border-gray-600/50 text-gray-300 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaCode />
          </div>
          <input
            name="skills"
            value={formData.skills}
            onChange={(e) => setFormData({...formData, skills: e.target.value})}
            placeholder="JavaScript, React, Node.js"
            className="w-full pl-10 pr-3 py-2.5 bg-gray-700/50 rounded-lg border border-gray-600/50 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaLinkedin />
          </div>
          <input
            name="linkedin"
            value={formData.linkedin}
            onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
            placeholder="https://linkedin.com/in/username"
            className="w-full pl-10 pr-3 py-2.5 bg-gray-700/50 rounded-lg border border-gray-600/50 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaGithub />
          </div>
          <input
            name="github"
            value={formData.github}
            onChange={(e) => setFormData({...formData, github: e.target.value})}
            placeholder="https://github.com/username"
            className="w-full pl-10 pr-3 py-2.5 bg-gray-700/50 rounded-lg border border-gray-600/50 text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-medium transition-all shadow-lg hover:shadow-purple-500/20"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;