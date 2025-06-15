import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    message: ''
  });
  
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ success: false, message: '' });
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setSubmitStatus({
        success: false,
        message: 'All fields are required.'
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
       const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      // For demo, we'll simulate success
      setSubmitStatus({
        success: true,
        message: 'Message sent successfully! We will get back to you soon.'
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'An error occurred. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <br></br>
        <br></br>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact <span className="text-indigo-600">Us</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you. Fill out the form below and our team will respond promptly.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className={`bg-white rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-500 ${isVisible ? 'translate-y-0' : 'translate-y-10'}`}>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full mr-4">
                <FaPaperPlane className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Send a Message</h2>
            </div>
            
            {submitStatus.message && !submitStatus.success && (
              <div className={`mb-6 p-4 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {submitStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm"
                  placeholder="Raj Sharma"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    placeholder="raj.sharma@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm"
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-300 ${
                    isSubmitting 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-1 shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <FaPaperPlane className="mr-2" />
                      Send Message
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className={`bg-white rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-700 ${isVisible ? 'translate-y-0' : 'translate-y-10'}`}>
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Our Information</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex-shrink-0 mt-1 mr-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Email Us</h3>
                  <a 
                    href="mailto:contact@indiatech.com" 
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                  >
                    contact@indiatech.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex-shrink-0 mt-1 mr-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full">
                    <FaPhone className="text-white text-xl" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Call Us</h3>
                  <a 
                    href="tel:+919876543210" 
                    className="text-gray-600 hover:text-indigo-600 transition-colors duration-300"
                  >
                    +91 98765 43210
                  </a>
                </div>
              </div>
              
              <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex-shrink-0 mt-1 mr-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Visit Us</h3>
                  <p className="text-gray-600">123 Tech Park, Sector 62, Noida, Uttar Pradesh 201301</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex-shrink-0 mt-1 mr-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full">
                    <FaClock className="text-white text-xl" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Working Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:30AM - 6:30PM</p>
                  <p className="text-gray-600">Saturday: 10AM - 2PM</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect with Us</h3>
              <div className="flex space-x-4">
                {[
                  { platform: 'facebook', color: '#3b5998' },
                  { platform: 'twitter', color: '#1DA1F2' },
                  { platform: 'instagram', color: '#E1306C' },
                  { platform: 'linkedin', color: '#0077B5' },
                  { platform: 'whatsapp', color: '#25D366' }
                ].map((item) => (
                  <a 
                    key={item.platform}
                    href="#" 
                    className="w-12 h-12 flex items-center justify-center rounded-full text-white transition-all duration-300 hover:scale-110 shadow-md"
                    style={{ backgroundColor: item.color }}
                    aria-label={item.platform}
                  >
                    <i className={`fab fa-${item.platform} text-lg`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Success Modal */}
        {submitStatus.success && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center transform transition-transform duration-500 scale-100">
              <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
              <p className="text-gray-600 mb-6">We've received your message and will get back to you soon.</p>
              <button 
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors duration-300 shadow-md"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;