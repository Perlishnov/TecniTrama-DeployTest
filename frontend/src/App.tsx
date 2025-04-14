import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import DashboardPage from "./pages/dashboard";
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
import { Outlet } from "react-router-dom";
import ChatPage from "./pages/chatPage";
import { useDecodeJWT } from "./hooks/useDecodeJWT";

const App = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const user = useDecodeJWT();

  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={isAuthenticated ? <Navigate to='/dashboard'/>  :<Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to='/dashboard'/>  :<Register />} />
        <Route path="/" element={<Navigate to='/login'/>} />

        {/* Rutas protegidas con layout */}
        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CreatorLayout>
                <Outlet />
              </CreatorLayout>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/profile" element={<CreatorProfilePage />} />
          <Route path="/profile/edit-profile" element={<EditProfilePage />} />

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new-project" element={<NewProject />} />
          <Route path="/projects/:projectId" element={<ProjectPreview />} />
          <Route path="/projects/:projectId/edit" element={<EditProject />} />

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/chats/*" element={<ChatPage user={user}/>} />
          <Route path="/applications" element={<RequestPage />} />
          <Route path="/settings" element={<CreatorProfilePage />} />
        </Route>

        {/* Ruta no encontrada */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>


      {/* Modal para notificaciones si hay background */}
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/notifications"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

export default App;
