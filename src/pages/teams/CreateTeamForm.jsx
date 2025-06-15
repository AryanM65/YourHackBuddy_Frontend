import React, { useState } from "react";
import { useTeam } from "../../contexts/TeamContext";
import { useParams, useNavigate } from "react-router-dom";

const CreateTeamForm = () => {
  const { hackathonId } = useParams();
  const { createTeam } = useTeam();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await createTeam({ name, hackathonId, idea });
      console.log("data", data);
      console.log("hackathonId", hackathonId)
      navigate(`/hackathon/${hackathonId}/your-team`);
    } catch (err) {
      console.error("Failed to create team:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Create Your Team</h1>
          <p className="text-blue-100 mt-2">Start your hackathon journey</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Team Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. Code Warriors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="idea" className="block text-sm font-medium text-gray-700">
              Project Idea
            </label>
            <textarea
              id="idea"
              placeholder="Describe your innovative solution..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Team...
              </>
            ) : (
              "Create Team"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTeamForm;