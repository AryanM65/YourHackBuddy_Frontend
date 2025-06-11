import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { FaExclamationCircle, FaCheckCircle, FaInfoCircle, FaSpinner } from 'react-icons/fa';

const ComplaintForm = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    againstType: 'User',
    message: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const againstTypeOptions = [
    { value: 'User', label: 'Another User' },
    { value: 'Team', label: 'A Team' },
    { value: 'Hackathon', label: 'A Hackathon' },
    { value: 'System', label: 'System/Platform' }
  ];

  const validateForm = () => {
    const errors = {};
    if (!formData.againstType) errors.againstType = 'Please select a complaint type';
    if (!formData.message.trim()) errors.message = 'Please enter your complaint details';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        againstType: formData.againstType,
        message: formData.message
      };

      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/add-complaint`, payload, {
        withCredentials: true
      });

      setSuccess('Complaint submitted successfully!');
      setTimeout(() => navigate('/complaints'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-purple-500/20">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">
            Submit a Complaint
          </h2>

          {(error || success) && (
            <div className={`mb-6 p-4 rounded-lg ${error ? 'bg-red-900/30 border-red-500/30' : 'bg-green-900/30 border-green-500/30'} 
              border flex items-center gap-3`}>
              {error ? (
                <>
                  <FaExclamationCircle className="text-red-400 flex-shrink-0" />
                  <span className="text-red-300">{error}</span>
                </>
              ) : (
                <>
                  <FaCheckCircle className="text-green-400 flex-shrink-0" />
                  <span className="text-green-300">{success}</span>
                </>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              {/* Complaint Type */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  What is your complaint about?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {againstTypeOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, againstType: option.value })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.againstType === option.value
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-600 hover:border-purple-400/50'
                      }`}
                    >
                      <span className={`font-medium ${
                        formData.againstType === option.value 
                          ? 'text-purple-400' 
                          : 'text-gray-300'
                      }`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
                {validationErrors.againstType && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <FaExclamationCircle /> {validationErrors.againstType}
                  </p>
                )}
              </div>

              {/* Complaint Details */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Detailed Description
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-200 h-40"
                  placeholder="Please describe your complaint in detail..."
                />
                {validationErrors.message && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <FaExclamationCircle /> {validationErrors.message}
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-2">
                  <FaInfoCircle className="inline mr-1" />
                  Please include any relevant details, timestamps, and evidence if available.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Complaint'
              )}
            </button>

            <p className="text-gray-400 text-sm text-center mt-4">
              By submitting this complaint, you agree to our {' '}
              <a href="/terms" className="text-purple-400 hover:underline">
                Terms of Service
              </a>. We take all complaints seriously and will respond within 48 hours.
            </p>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Need help? Check our {' '}
            <a href="/faq" className="text-purple-400 hover:underline">
              FAQ
            </a> {' '}
            or {' '}
            <a href="/support" className="text-purple-400 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;