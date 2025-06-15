import React, { useState, useRef } from "react";
import { useUser } from "../contexts/UserContext";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserShield,
  FaSchool,
  FaBriefcase,
  FaCode,
  FaPen,
  FaLinkedin,
  FaGithub,
  FaBuilding,
  FaExclamationTriangle,
  FaCamera,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Signup = () => {
  const { signup, loading } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "Student",
    skills: "",
    bio: "",
    linkedin: "",
    github: "",
    institute: "",
    designation: "Other",
    organizationEmail: "",
  });
  const [error, setError] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);

  const roles = ["Student", "Organization"];
  const designations = ["Student", "Working Professional", "Freelancer", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB");
      return;
    }

    setError("");
    setProfilePicture(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setPreviewImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate mandatory fields
    if (
      !formData.name.trim() ||
      !formData.username.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      setError("Please fill all mandatory fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Role-specific validation
    if (
      formData.role === "Student" &&
      (!formData.institute.trim() || !formData.designation.trim())
    ) {
      setError("Institute and Designation are required for students");
      return;
    }

    if (formData.role === "Organization") {
      if (!formData.organizationEmail.trim()) {
        setError("Organization email is required");
        return;
      }

      if (!emailRegex.test(formData.organizationEmail)) {
        setError("Please enter a valid organization email address");
        return;
      }
    }

    try {
      // Create FormData object for file upload
      const formDataObj = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      // Append profile picture if exists
      if (profilePicture) {
        formDataObj.append("profilePicture", profilePicture);
      }

      await signup(formDataObj);
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <FaUser className="text-white/80" />
            <span>Create Account</span>
          </h2>
          <p className="mt-2 text-blue-100/90">
            Join our platform and start your journey
          </p>
        </div>

        <div className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <FaExclamationTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-600">{error}</span>
            </div>
          )}

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400 text-3xl" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
              >
                <FaCamera className="text-sm" />
              </button>
              {previewImage && (
                <button
                  type="button"
                  onClick={removeProfilePicture}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <p className="mt-2 text-sm text-gray-500">
              Click to upload profile photo (max 2MB)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaUser className="text-gray-500" />
                    <span>
                      Full Name <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaUser className="text-gray-500" />
                    <span>
                      Username <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" />
                    <span>
                      Email <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaLock className="text-gray-500" />
                    <span>
                      Password <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-6">
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUserShield className="text-blue-500" />
                  Account Type
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {roles.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, role }))}
                      className={`p-4 rounded-xl border-2 transition-all flex items-center gap-2 ${
                        formData.role === role
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-200"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          formData.role === role
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {role === "Organization" ? (
                          <FaBuilding />
                        ) : (
                          <FaUser />
                        )}
                      </div>
                      <span
                        className={`font-medium ${
                          formData.role === role
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Role-specific Fields */}
              {formData.role === "Student" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaSchool className="text-gray-500" />
                      <span>
                        Institute <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      name="institute"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.institute}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaBriefcase className="text-gray-500" />
                      <span>
                        Designation <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <select
                      name="designation"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.designation}
                      onChange={handleChange}
                      required
                    >
                      {designations.map((designation) => (
                        <option key={designation} value={designation}>
                          {designation}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {formData.role === "Organization" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <FaEnvelope className="text-gray-500" />
                      <span>
                        Organization Email <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="email"
                      name="organizationEmail"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      value={formData.organizationEmail}
                      onChange={handleChange}
                      placeholder="contact@your-organization.com"
                      required
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                    <FaExclamationTriangle className="text-yellow-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-700">
                        Your organization needs to be registered first.{" "}
                        <Link
                          to="/register-organization"
                          className="font-medium text-yellow-800 hover:text-yellow-900 underline"
                        >
                          Register your organization
                        </Link>{" "}
                        if you haven't already.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Fields for Students */}
            {formData.role === "Student" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaCode className="text-gray-500" />
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="JavaScript, React, Node.js"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaPen className="text-gray-500" />
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Social Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaLinkedin className="text-gray-500" />
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedin"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaGithub className="text-gray-500" />
                  GitHub Profile
                </label>
                <input
                  type="url"
                  name="github"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-all disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;