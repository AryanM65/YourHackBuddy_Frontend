import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, sendOTP, verifyOTP, loading } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loginMethod, setLoginMethod] = useState("password"); // 'password' or 'otp'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleSendOTP = async () => {
    if (!otpEmail) {
      setOtpError("Please enter your email address");
      return;
    }
    
    setOtpError(null);
    
    try {
      await sendOTP(otpEmail);
      setOtpSent(true);
    } catch (err) {
      setOtpError(err);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode) {
      setOtpError("Please enter the OTP code");
      return;
    }
    
    try {
      await verifyOTP(otpEmail, otpCode);
      navigate('/home');
    } catch (err) {
      setOtpError(err);
    }
  };

  const toggleLoginMethod = () => {
    setLoginMethod(loginMethod === "password" ? "otp" : "password");
    setError(null);
    setOtpError(null);
    setOtpSent(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-3xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-2 rounded-full mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="mt-2 text-purple-500/80">Please sign in to continue</p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center bg-purple-50 rounded-full p-1">
            <button
              onClick={() => setLoginMethod("password")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                loginMethod === "password" 
                  ? "bg-white shadow text-purple-600" 
                  : "text-purple-500 hover:text-purple-700"
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setLoginMethod("otp")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                loginMethod === "otp" 
                  ? "bg-white shadow text-purple-600" 
                  : "text-purple-500 hover:text-purple-700"
              }`}
            >
              OTP Code
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 rounded-lg flex items-center gap-2 text-red-700 border border-red-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Password Login Form */}
        {loginMethod === "password" ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder-purple-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Enter your email"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3.5 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder-purple-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3.5 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white py-3.5 rounded-lg font-semibold text-sm tracking-wide transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:transform-none shadow-lg shadow-purple-200"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        ) : (
          /* OTP Login Form */
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all placeholder-purple-300"
                  value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3.5 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 rounded-lg font-semibold text-sm tracking-wide transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:transform-none shadow-lg shadow-blue-100"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending OTP...</span>
                </div>
              ) : (
                "Send Login Code"
              )}
            </button>

            {otpSent && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-blue-700 text-sm">
                    We've sent a 6-digit code to <span className="font-medium">{otpEmail}</span>. 
                    Please check your inbox and enter it below.
                  </p>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-purple-700 mb-1">Enter Code</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                    />
                    <button
                      onClick={handleVerifyOTP}
                      disabled={loading || !otpCode}
                      className="ml-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-3 rounded-lg font-medium text-sm transition-all disabled:opacity-50 shadow shadow-purple-200"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            )}

            {otpError && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center gap-2 text-red-700 border border-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{otpError}</span>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-center text-sm text-purple-500">
          Don't have an account?{' '}
          <a href="/signup" className="text-purple-600 font-semibold hover:text-purple-700 hover:underline transition-colors">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;