import React, { useState } from "react";
import { useTeam } from "../../contexts/TeamContext";
import { useParams, useNavigate } from "react-router-dom";

const CreateTeamForm = () => {
  const { hackathonId } = useParams();
  const { createTeam } = useTeam();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [idea, setIdea] = useState("");
  const [memberEmails, setMemberEmails] = useState([""]);
  const [loading, setLoading] = useState(false);

  const handleMemberEmailChange = (index, value) => {
    const updated = [...memberEmails];
    updated[index] = value;
    setMemberEmails(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await createTeam({ name, hackathonId, idea });
      navigate(`/team/${data.team._id}`);
    } catch (err) {
      console.error("Failed to create team:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-6">Create Your Team</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          placeholder="Team Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded"
        />

        <textarea
          placeholder="Team's Idea"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </div>
  );
};

export default CreateTeamForm;
