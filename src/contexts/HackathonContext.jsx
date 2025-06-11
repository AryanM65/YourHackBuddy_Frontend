import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const HackathonContext = createContext();
const BASE_URL = `${import.meta.env.VITE_SERVER_URL}/api/v1`;

export const HackathonProvider = ({ children }) => {
  const [hackathons, setHackathons] = useState([]);
  const [myHackathons, setMyHackathons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  const [orgHackathons, setOrgHackathons] = useState([]);

  const fetchAllHackathons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/allhackathons`);
      setHackathons(res.data.data);
    } catch (err) {
      console.error("Error fetching all hackathons:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyHackathons = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/my-hackathons`, {
        withCredentials: true,
      });
      setMyHackathons(res.data.data);
    } catch (err) {
      console.error("Error fetching my hackathons:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHackathonById = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/hackathon/${id}`, {
        withCredentials: true,
      });
      setSelectedHackathon(res.data.data);
      return res.data; // If you want to access leader and success too
    } catch (err) {
      console.error("Error fetching hackathon by ID:", err);
    } finally {
      setLoading(false);
    }
  };

  const addHackathon = async (hackathonData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${BASE_URL}/addhackathon`, hackathonData, {
        withCredentials: true,
      });
      await fetchAllHackathons();
      return res.data; // In case caller needs the new hackathon
    } catch (err) {
      console.error("Error adding hackathon:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHackathons();
  }, []);


  const fetchOrgHackathons = async (organizationId) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/get-organization-hackathons`,
        { organizationId },
        { withCredentials: true }
      );
      console.log("res", res);
      setOrgHackathons(res.data.data);
      console.log("after setting", orgHackathons);
      return res.data.data;
    } catch (err) {
      console.error("Error fetching organization hackathons:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateHackathonStatus = async (id, status) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/hackathon/status`,
        { id, status },
        { withCredentials: true }
      );

      if (res.data.success) {
        // Update all state arrays that might contain this hackathon
        const updatedHackathon = res.data.data;
        
        // Update orgHackathons
        setOrgHackathons(prev => 
          prev.map(h => h._id === hackathonId ? updatedHackathon : h)
        );
        
        // Update hackathons (all hackathons)
        setHackathons(prev => 
          prev.map(h => h._id === hackathonId ? updatedHackathon : h)
        );
        
        // Update myHackathons
        setMyHackathons(prev => 
          prev.map(h => h._id === hackathonId ? updatedHackathon : h)
        );
        
        // Update selectedHackathon if it's the current one
        if (selectedHackathon && selectedHackathon._id === hackathonId) {
          setSelectedHackathon(updatedHackathon);
        }
        
        return res.data;
      }
    } catch (err) {
      console.error("Error updating hackathon status:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <HackathonContext.Provider
      value={{
        hackathons,
        myHackathons,
        selectedHackathon,
        loading,
        fetchAllHackathons,
        fetchMyHackathons,
        fetchHackathonById,
        addHackathon,
        fetchOrgHackathons,
        updateHackathonStatus,
      }}
    >
      {children}
    </HackathonContext.Provider>
  );
};

export const useHackathon = () => useContext(HackathonContext);
