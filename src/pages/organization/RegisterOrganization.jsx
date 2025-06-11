import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBuilding, FaEnvelope, FaFileAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const RegisterOrganization = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.email.trim()) {
      return setError('Organization name and email are required');
    }

    if (!validateEmail(formData.email)) {
      return setError('Please enter a valid email address');
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/add-new-organization`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess('Organization registered successfully! You will be redirected shortly.');
        setFormData({ name: '', email: '', description: '' });
        
        setTimeout(() => {
          navigate('/signup');
        }, 2500);
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 
                      err.message || 
                      'Server error. Please try again later.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="mx-auto bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <FaBuilding className="text-blue-600 text-3xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Register Your Organization
          </h1>
          <p className="mt-3 text-gray-600 max-w-md mx-auto">
            Get your organization registered to start posting opportunities and connecting with talent
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white hidden md:block">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Organization Registration</h2>
                  <p className="text-blue-100">
                    Register your organization to access our platform's full capabilities.
                  </p>
                </div>
                
                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 rounded-full p-2 mt-0.5">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    <p className="text-blue-100 text-sm">
                      Post internships, jobs, and projects
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 rounded-full p-2 mt-0.5">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    <p className="text-blue-100 text-sm">
                      Access a talented pool of students and professionals
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 rounded-full p-2 mt-0.5">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                    <p className="text-blue-100 text-sm">
                      Manage applications and candidates
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 p-8">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 mb-6">
                  <FaExclamationTriangle className="text-red-600 flex-shrink-0" />
                  <span className="text-red-600">{error}</span>
                </div>
              )}
              
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 mb-6">
                  <FaCheckCircle className="text-green-600 flex-shrink-0" />
                  <span className="text-green-600">{success}</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaBuilding className="text-gray-500" />
                    <span>Organization Name <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter organization name"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-gray-500" />
                    <span>Contact Email <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="contact@organization.com"
                    required
                  />
                </div>
                
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FaFileAlt className="text-gray-500" />
                    <span>Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Briefly describe your organization..."
                    rows={4}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className={`w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-xl font-semibold transition-all hover:opacity-95 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-70 ${loading ? 'cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Registering Organization...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <FaBuilding className="text-white" />
                      Register Organization
                    </span>
                  )}
                </button>
                
                <div className="mt-6 text-center">
                  <button 
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    ← Back to Sign Up
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Need help? Contact us at support@example.com</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterOrganization;