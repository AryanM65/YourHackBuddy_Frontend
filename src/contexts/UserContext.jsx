import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const saveUser = (userData) => {
    setUser(userData ? {
      ...userData,
      id: userData._id,
      name: userData.name || '',
      email: userData.email
    } : null);
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/profile`, {
        withCredentials: true,
      });
      saveUser(res.data?.user || null);
    } catch (err) {
      saveUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/login`,
        { email, password },
        { withCredentials: true }
      );
      
      // Immediately update local state
      saveUser(res.data?.user || null);
      
      // Force re-check authentication
      await fetchUser();
      
      navigate("/");
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

    const sendOTP = async (email) => {
    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/api/v1/send-otp`,
        { email },
        { withCredentials: true }
      );
      return true;
    } catch (err) {
      console.error("Failed to send OTP", err);
      throw err.response?.data?.message || "Failed to send OTP";
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/api/v1/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      
      // Immediately update local state
      saveUser(res.data?.user || null);
      
      // Force re-check authentication
      await fetchUser();
      
      navigate("/");
      return res.data;
    } catch (err) {
      console.error("OTP verification failed", err);
      throw err.response?.data?.message || "Invalid OTP. Please try again.";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signup = async (formData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/api/v1/signup`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      //saveUser(res.data.user);
      navigate("/login");
    } catch (err) {
      console.error("Signup failed", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/v1/logout`,
        {},
        { withCredentials: true }
      );
      saveUser(null);
      localStorage.removeItem("user");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/v1/profile/edit`,
        updates,
        { withCredentials: true }
      );
      saveUser(res.data.user);
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchAllUsers = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v1/admin/users`, {
        withCredentials: true,
      });
      
      if (!res.data?.users) {
        throw new Error('Invalid response structure');
      }
      
      const users = res.data.users;
      setAllUsers(users);
      return users;
      
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setAllUsers([]);
      throw err;
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        fetchUser,
        updateProfile,
        fetchAllUsers,
        sendOTP,
        verifyOTP
      }}
    >
      {children}
    </UserContext.Provider>
  );
};


