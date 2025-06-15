import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import axios from "axios";

const Navbar = () => {
  const { user, logout, loading } = useUser();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const handleLogout = async () => {
    setNotifications([]); // Clear notifications on logout
    await logout();
    navigate("/login");
  };

  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : "";

  // Fetch notifications when component mounts and when user changes
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = () => {
      axios
        .get(`${serverUrl}/api/v1/get-all-notifications`, { withCredentials: true })
        .then((res) => {
          if (res.data.notifications) setNotifications(res.data.notifications);
        })
        .catch((err) => console.error("Error fetching notifications:", err));
    };

    // Initial fetch
    fetchNotifications();

    // Optional: Set up polling (fetch every 30 seconds)
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user, serverUrl]);

  // Additional fetch when popup is opened to ensure fresh data
  useEffect(() => {
    if (showPopup && user) {
      axios
        .get(`${serverUrl}/api/v1/get-all-notifications`, { withCredentials: true })
        .then((res) => {
          if (res.data.notifications) setNotifications(res.data.notifications);
        })
        .catch((err) => console.error("Error fetching notifications:", err));
    }
  }, [showPopup, serverUrl, user]);

  const markAsRead = (id) => {
    axios
      .put(`${serverUrl}/api/v1/${id}/read`, {}, { withCredentials: true })
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
      })
      .catch((err) => console.error("Error marking notification read:", err));
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
    Promise.all(
      unreadIds.map((id) =>
        axios.put(`${serverUrl}/api/v1/${id}/read`, {}, { withCredentials: true })
      )
    )
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      })
      .catch((err) => console.error("Error marking all as read:", err));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    if (showPopup) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const readNotifications = notifications.filter((n) => n.isRead);

  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="backdrop-blur-md bg-gray-900/80 border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              YourHackBuddy
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
      scrolled 
        ? 'backdrop-blur-md bg-gray-900/90 border-b border-purple-500/30 shadow-lg shadow-purple-500/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center relative">
          <Link to={user ? "/home" : "/"} className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-400 transition-all duration-300">
            YourHackBuddy
          </Link>

          {!user ? (
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium">
                Home
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium">
                About
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium">
                Contact
              </Link>
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-lg border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 font-medium"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all duration-300 font-medium shadow-lg hover:shadow-purple-500/25"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <Link to="/home" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium">
                Home
              </Link>
              <Link to="/hackathons" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium">
                Hackathons
              </Link>

              {/* Add Hackathon Button (Organization Only) */}
              {user.role === 'Organization' && (
                <Link 
                  to="/add-hackathon" 
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-500 hover:to-teal-500 transition-all duration-300 font-medium shadow-lg hover:shadow-green-500/25"
                >
                  Add Hackathon
                </Link>
              )}
              
              {/* Admin Specific Buttons */}
              {user.role === 'Admin' && (
                <>
                  <Link 
                    to="/view-complaints" 
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/25"
                  >
                    View Complaints
                  </Link>
                  <Link 
                    to="/admin/add-announcement" 
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-all duration-300 font-medium shadow-lg hover:shadow-purple-500/25"
                  >
                    Add Announcement
                  </Link>
                </>
              )}

              <button
                onClick={() => setShowPopup((prev) => !prev)}
                className="relative text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium focus:outline-none"
                title="Notifications"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3-3V9a6 6 0 10-12 0v5l-3 3h5a6 6 0 1012 0z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-xs rounded-full px-1.5 py-0.5 text-white font-bold min-w-5 text-center shadow-lg">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showPopup && (
                <div
                  ref={popupRef}
                  className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-gray-900/95 backdrop-blur-md border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 z-50"
                >
                  <div className="flex justify-between items-center px-4 py-3 border-b border-purple-500/20">
                    <h3 className="text-white font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-purple-400 hover:text-purple-300 hover:underline text-sm transition-colors duration-200"
                        title="Mark all as read"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  {unreadNotifications.length === 0 && readNotifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <svg className="w-12 h-12 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3-3V9a6 6 0 10-12 0v5l-3 3h5a6 6 0 1012 0z" />
                      </svg>
                      <p className="text-gray-400">No notifications yet</p>
                    </div>
                  ) : (
                    <>
                      {unreadNotifications.length > 0 && (
                        <div className="px-4 py-2">
                          <h4 className="text-purple-400 font-semibold text-sm mb-2">Unread</h4>
                          {unreadNotifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => markAsRead(n._id)}
                              className="p-3 mb-2 cursor-pointer rounded-lg bg-purple-900/50 hover:bg-purple-800/50 border border-purple-500/20 transition-all duration-200"
                              title={n.message}
                            >
                              <p className="text-sm text-gray-200">{n.message}</p>
                              <small className="text-gray-400 text-xs">
                                {new Date(n.createdAt).toLocaleString()}
                              </small>
                            </div>
                          ))}
                        </div>
                      )}

                      {readNotifications.length > 0 && (
                        <div className="px-4 py-2">
                          <h4 className="text-gray-400 font-semibold text-sm mb-2">Read</h4>
                          {readNotifications.map((n) => (
                            <div
                              key={n._id}
                              className="p-3 mb-2 rounded-lg bg-gray-800/50 border border-gray-700/50"
                              title={n.message}
                            >
                              <p className="text-sm text-gray-300">{n.message}</p>
                              <small className="text-gray-500 text-xs">
                                {new Date(n.createdAt).toLocaleString()}
                              </small>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              <Link
                to="/dashboard"
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white uppercase select-none cursor-pointer hover:shadow-purple-500/25 transition-all duration-300 shadow-lg overflow-hidden"
                title={user.name}
              >
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center hover:from-purple-500 hover:to-pink-500">
                    {avatarLetter}
                  </div>
                )}
              </Link>

              {user.role !== 'Admin' && <Link to="/complaints" className="text-gray-300 hover:text-purple-400 transition-colors duration-300 font-medium">
                Complaints
              </Link>}

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-all duration-300 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;