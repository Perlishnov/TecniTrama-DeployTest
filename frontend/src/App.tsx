import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import ProtectedRoute from "./components/protectedRoute";
import { useAuth } from "./hooks/auth";
import CreatorLayout from "./layouts/default";
import CreatorProfilePage from "./pages/Creator/creatorProfilePage";
import EditProfilePage from "./pages/Creator/EditProfilePage";
import ProjectPreview from "./pages/Creator/ProjectPreview";
import EditProject from "./pages/Creator/editProjectView";
import NewProject from "./pages/Creator/newProject";
import RequestPage from "./pages/Applicant/requestPage";
import ProjectsPage from "./pages/projects";
import NotificationsPage from "./pages/notificacion";

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />

      {/* Rutas protegidas */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreatorLayout >
              <h1>Hola</h1>
            </CreatorLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CreatorProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit-profile"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EditProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Outlet />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<ProjectsPage />} />
        <Route path=":projectId" element={<ProjectPreview />} />
        <Route path="new-project" element={<NewProject />} />
        <Route path=":projectId/edit" element={<EditProject />} />
        <Route path="my" element={<Home />} />
      </Route>


      <Route
        path="/notifications"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chats/*"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <RequestPage />
          </ProtectedRoute>
        }
      />

      {/* Redirecciona a Home para rutas no definidas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
