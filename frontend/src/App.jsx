import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import RecommendationPage from "./pages/RecommendationPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import DashboardPage from "./pages/DashboardPage";
import SavedProjectsPage from "./pages/SavedProjectsPage";
import LearningProgressPage from "./pages/LearningProgressPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute><RecommendationPage /></ProtectedRoute>} />
      <Route path="/project/:id" element={<ProtectedRoute><ProjectDetailsPage /></ProtectedRoute>} />
      <Route path="/saved" element={<ProtectedRoute><SavedProjectsPage /></ProtectedRoute>} />
      <Route path="/learning" element={<ProtectedRoute><LearningProgressPage /></ProtectedRoute>} />
      <Route path="/learning/:projectId" element={<ProtectedRoute><LearningProgressPage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
