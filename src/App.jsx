import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { TeamProvider } from "./contexts/TeamContext";
import { HackathonProvider } from "./contexts/HackathonContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AllHackathons from "./pages/hackathons/AllHackathons";
import HackathonDetails from "./pages/hackathons/HackathonDetails";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import CreateTeamForm from "./pages/teams/CreateTeamForm";
import AllTeams from "./pages/teams/AllTeams";
import YourTeam from "./pages/teams/YourTeam";
import TeamRequestsPage from "./pages/teams/TeamRequestsPage";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import ResumeUploadPage from "./pages/teams/ResumeUploadPage";
import ComplaintForm from "./pages/ComplaintForm";
import AdminComplaintsPage from "./pages/admin/AdminComplaintsPage";
import AllHackathonAnalytics from "./pages/admin/AllHackathonAnalytics";
import TeamAnalytics from "./pages/admin/TeamAnalytics";
import RegisterOrganization from "./pages/organization/RegisterOrganization";
import AddHackathonForm from "./pages/organization/AddHackathonForm"
import TeamSubmissionsPage from "./pages/teams/TeamSubmissionsPage";
function App() {
  return (
    <Router>
      <TeamProvider>
        <HackathonProvider>
          <UserProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path = "/hackathon/:hackathonId/teams/:teamId/requests" element = {<TeamRequestsPage />} />
                  <Route path="/hackathon/:hackathonId/teams/create" element={<CreateTeamForm />} />
                  <Route path="/hackathon/:hackathonId/teams" element={<AllTeams />} />
                  <Route path="/hackathon/:hackathonId/your-team" element={<YourTeam />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path = "/hackathons" element = {<AllHackathons />} />
                  <Route path="/hackathons/:id" element={<HackathonDetails />} />
                  <Route path = "/" element = {<LandingPage />} />
                  <Route path = "/about" element = {<AboutPage />} />
                  <Route path = "/dashboard" element = {<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path = '/edit-profile' element = {<EditProfile />} />
                  <Route path=":hackathonId/upload-resume" element={<ResumeUploadPage />} />
                  <Route path = "/complaints" element = {<ComplaintForm />} />
                  <Route path = "/add-hackathon" element = {<AddHackathonForm />} />
                  <Route path = "/view-complaints" element = {<AdminComplaintsPage />} />
                  <Route path = "all-hackathon-analytics" element = {<AllHackathonAnalytics />} /> 
                  <Route path="/hackathons/:hackathonId/analytics/teams" element={<TeamAnalytics />} />
                  <Route path = "/register-organization" element = {<RegisterOrganization />} />
                  <Route path="/hackathons/:hackathonId/teams/:teamId/submissions" element={<TeamSubmissionsPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </UserProvider>
        </HackathonProvider>
      </TeamProvider>
    </Router>
  );
}

export default App;
