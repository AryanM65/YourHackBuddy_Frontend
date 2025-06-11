import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useUser } from "./UserContext";

const TeamContext = createContext();

export const useTeam = () => useContext(TeamContext);

export const TeamProvider = ({ children }) => {
  //const { user } = useUser();

  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = `${import.meta.env.VITE_SERVER_URL}/api/v1`;

  const handleError = (err) => {
    const message =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "Error";
    setError(message);
    throw new Error(message);
  };

  const createTeam = async ({ name, hackathonId, idea }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `${API_BASE}/create-team`,
        { name, hackathonId, idea },
        { withCredentials: true }
      );
      setCurrentTeam(data.team);
      return data;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const registerTeamForHackathon = async ({ teamId, hackathonId }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `${API_BASE}/register-team`,
        { teamId, hackathonId },
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const generateJoinCode = async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `${API_BASE}/${teamId}/generate-join-code`,
        {},
        { withCredentials: true }
      );
      return data.joinCode;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const joinTeamByCode = async (joinCode) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `${API_BASE}/join-by-code`,
        { joinCode },
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const getTeamById = async (teamId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_BASE}/team/${teamId}`, {
        withCredentials: true,
      });
      setCurrentTeam(data.team);
      return data.team;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const getTeamsForHackathon = async (hackathonId) => {
    setLoading(true);
    setError(null);
    try {
      const {data} = await axios.get(
        `${API_BASE}/hackathon/${hackathonId}/teams`,
        { withCredentials: true }
      );
      //console.log("data teams", res)
      setTeams(data.teams);
      console.log("data.teams",data.teams);
      return data.teams;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const getTeamsFromYourInstitute = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`${API_BASE}/from-institute`, {
        withCredentials: true,
      });
      setTeams(data.teams);
      return data.teams;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

    const getUserTeams = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `${API_BASE}/get-user-teams`,
        { userId }, // <-- request body
        { withCredentials: true }
      );
      setTeams(data);
      return data;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

    const getUserTeamForHackathon = async (hackathonId) => {
    setLoading(true);
    setError(null);
    try {
        const { data } = await axios.post(
        `${API_BASE}/your-team`,
        { hackathonId }, // send in request body
        { withCredentials: true }
        );

        console.log("team data", data.team);
        setCurrentTeam(data.team);
        return data.team;
    } catch (err) {
        handleError(err);
    } finally {
        setLoading(false);
    }
    };

    const getTeamRequests = async (teamId) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(`${API_BASE}/team/${teamId}/view-requests`, {
            withCredentials: true,
            });
            console.log("request data", data);
            return data.requests; // Assuming `data.requests` is the array from the controller
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };


    const handleTeamRequestResponse = async (requestId, action) => {
  // action can be 'accept' or 'reject'
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.post(
            `${API_BASE}/team-join-request/respond`,
            { requestId, action },
            { withCredentials: true }
            );
            return data;
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const sendTeamJoinRequest = async ({ teamId, message }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `${API_BASE}/team-join-request/send`,
        { teamId, message },
        { withCredentials: true }
      );
      console.log(data);
      return data;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async (teamId, hackathonId, file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("teamId", teamId);
      formData.append("hackathonId", hackathonId);

      const { data } = await axios.post(
        `${API_BASE}/upload/resume`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const getTeamSubmissions = async (teamId, hackathonId) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `${API_BASE}/get-team-submissions`,
        { teamId, hackathonId },
        { withCredentials: true }
      );
      return data.submission;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }};

    const suspendTeam = async (teamId) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.put(
          `${API_BASE}/suspend`,
          { teamId },
          { withCredentials: true }
        );
        return data;
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
  };

  const toggleTeamShortlist = async (teamId, shortlisted) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(
        `${API_BASE}/shortlist`,
        { teamId, shortlisted }, // Send both teamId and desired shortlist status
        { withCredentials: true }
      );

      // Update local state to reflect changes
      setTeams(prevTeams => 
        prevTeams.map(team => 
          team._id === teamId ? { ...team, shortlisted } : team
        )
      );

      // Update current team if it's the one being modified
      if (currentTeam && currentTeam._id === teamId) {
        setCurrentTeam({ ...currentTeam, shortlisted });
      }

      return data;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        currentTeam,
        loading,
        error,
        createTeam,
        registerTeamForHackathon,
        generateJoinCode,
        joinTeamByCode,
        getTeamById,
        getTeamsForHackathon,
        getTeamsFromYourInstitute,
        getUserTeams,
        getUserTeamForHackathon,
        handleTeamRequestResponse,
        getTeamRequests,
        sendTeamJoinRequest,
        getTeamSubmissions,
        uploadResume,
        suspendTeam,
        toggleTeamShortlist,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
