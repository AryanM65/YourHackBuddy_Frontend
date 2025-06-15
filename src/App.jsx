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
import AddAnnouncement from "./pages/admin/AddAnnoucement";
import ContactPage from "./pages/ContactPage";
import Profile from "./pages/Profile";
import ViewTeamPage from "./pages/ViewTeamPage";
import RoleProtectedRoute from "./components/RoleProtectedRoute"; // or wherever it is
import { Navigate } from "react-router-dom";
import { useUser } from "./contexts/UserContext"; // adjust path if needed

const StudentOrOtherWrapper = ({ children }) => (
  <RoleProtectedRoute allowedRoles={["Student", "Other"]}>
    {children}
  </RoleProtectedRoute>
);

const AdminWrapper = ({ children }) => (
  <RoleProtectedRoute allowedRoles={["Admin"]}>
    {children}
  </RoleProtectedRoute>
);

const OrganizationWrapper = ({ children }) => (
  <RoleProtectedRoute allowedRoles={["Organization"]}>
    {children}
  </RoleProtectedRoute>
);

const AllRolesWrapper = ({ children }) => (
  <RoleProtectedRoute allowedRoles={["Student", "Other", "Admin", "Organization"]}>
    {children}
  </RoleProtectedRoute>
);


const LandingRedirect = () => {
  const { user, loading } = useUser();

  if (loading) return <div className="text-center py-10 text-lg">Loading...</div>;

  return user ? <Navigate to="/home" replace /> : <LandingPage />;
};

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
                  {/* redirecting to landing page if not signed in or home page if signedin */}
                  <Route path="/" element={<LandingRedirect />} />
                  {/* where no protected route is needed */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path = "/about" element = {<AboutPage />} />
                  <Route path = "/contact" element = {<ContactPage />} />
                  <Route path = "/register-organization" element = {<RegisterOrganization />} />
                  <Route path="*" element={<NotFound />} />
                  <Route path = "/team/:teamId" element = {<ViewTeamPage />} />
                  {/* where no protected route is needed */}
                  <Route path = "/hackathon/:hackathonId/teams/:teamId/requests" element = {<TeamRequestsPage />} />
                  <Route path="/hackathon/:hackathonId/teams/create" element={<CreateTeamForm />} />
                  <Route path="/hackathon/:hackathonId/teams" element={<AllTeams />} />
                  <Route path="/hackathon/:hackathonId/your-team" element={<YourTeam />} />
                  {/* Where all the users can access */}
                  <Route path="/home" element={<AllRolesWrapper><Home /></AllRolesWrapper>} />
                  <Route path = "/dashboard" element ={<AllRolesWrapper><Dashboard /></AllRolesWrapper>} />
                  <Route path="/profile/:userId" element={<AllRolesWrapper><Profile /></AllRolesWrapper>} />
                  <Route path = "/hackathons" element = {<AllRolesWrapper><AllHackathons /></AllRolesWrapper>} />
                  <Route path = "/complaints" element = {<AllRolesWrapper><ComplaintForm /></AllRolesWrapper>} />
                  <Route path="/hackathons/:id" element={<HackathonDetails />} />
                  <Route path = '/edit-profile' element = {<EditProfile />} />
                  {/* Where all the users can access */}
                  {/* Where only users can access */}
                  <Route path=":hackathonId/upload-resume" element={<StudentOrOtherWrapper ><ResumeUploadPage /></StudentOrOtherWrapper>} />
                  {/* where only users can access */}
                  <Route path = "/add-hackathon" element = {<OrganizationWrapper><AddHackathonForm /></OrganizationWrapper>} />
                  {/* admin only access */}
                  <Route path="/hackathons/:hackathonId/analytics/teams" element={<AdminWrapper><TeamAnalytics /></AdminWrapper>} />
                  <Route path = "/view-complaints" element = {<AdminWrapper><AdminComplaintsPage /></AdminWrapper>} />
                  <Route path = "all-hackathon-analytics" element = {<AdminWrapper><AllHackathonAnalytics /></AdminWrapper>} /> 
                  <Route path="/admin/add-announcement" element={<AdminWrapper><AddAnnouncement /></AdminWrapper>} />
                  {/* admin only access */}
                  <Route path="/hackathons/:hackathonId/teams/:teamId/submissions" element={<RoleProtectedRoute allowedRoles={["Admin", "Organization"]}><TeamSubmissionsPage /></RoleProtectedRoute>} />
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
