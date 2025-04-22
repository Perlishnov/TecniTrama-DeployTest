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
import { useStreamToken } from "./hooks/useStreamToken";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/Admin/dashboard";
import AdminProjects from "./pages/Admin/projects";
import UsersPage from "./pages/Admin/usersPage";
import { useEffect, useState } from "react";
import ConfigProvider from "antd/es/config-provider";

const App = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location };
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setAuthChecked(true);
    }
  }, [isAuthenticated]);
  

  const rawUser = useDecodeJWT();
  const streamToken = useStreamToken();

  const user = rawUser && streamToken
    ? {
        user_id: rawUser.id || rawUser.user_id,
        email: rawUser.email,
        streamToken,
      }
    : null;

  const isAdmin = rawUser?.user_type_id === 2;

  if (!authChecked) {
    return <div className="p-8">Cargando aplicación...</div>;
  }

  return (
    <>
      <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: '#FFC2B8', // bg-gray-100
            headerColor: '#000000', // text-gray-800
            rowHoverBg: '#FFEAE6',  // hover:bg-gray-50
            borderColor: '#000000', // border-gray-200
          },
          Button: {
            colorPrimary: '#FF9A8C', // bg-rojo-intec-100
            colorPrimaryHover: '#FF4C4C', // hover:bg-rojo-intec-200
          },
          Pagination:{
            itemBg: '#ffffff',
            itemActiveBg: '#FF9A8C', 
          },
          Dropdown: {
            colorSplit: 'rgba(0, 0, 0, 0.15)',
            controlItemBgHover: '#FF9A8C',
            controlItemBgActive: '#FFC2B8',
            colorPrimary: '#ffffff',
            fontFamily: 'Barlow',
          }
        }
      }}
    >
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              isAdmin ? <Navigate replace to="/admin/dashboard" /> : <Navigate replace to="/dashboard" />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              isAdmin ? <Navigate replace to="/admin/dashboard" /> : <Navigate replace to="/dashboard" />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/"
          element={
            isAuthenticated ? (
              isAdmin ? <Navigate replace to="/admin/dashboard" /> : <Navigate replace to="/dashboard" />
            ) : (
              <Navigate replace to="/login" />
            )
          }
        />

        {/* Rutas de administrador */}
        <Route
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated}
              adminRequired  // Indica que requiere ser admin
              isAdmin={isAdmin}  // Pasa el estado real del usuario
            >
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </ProtectedRoute>
          }
        >
          {/* Rutas de administrador */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/users" element={<UsersPage />} />
        </Route>

        {/* Rutas protegidas con layout de Creator */}
        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CreatorLayout>
                <Outlet />
              </CreatorLayout>
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<CreatorProfilePage />} />
          <Route path="/profile/edit-profile" element={<EditProfilePage />} />

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new-project" element={<NewProject />} />
          <Route path="/projects/:projectId" element={<ProjectPreview />} />
          <Route path="/projects/:projectId/edit" element={<EditProject />} />

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route
            path="/chats/*"
            element={
              user ? (
                <ChatPage user={user} />
              ) : (
                <div className="p-8">Cargando información del usuario...</div>
              )
            }
          />
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
      </ConfigProvider>
    </>
  );
};

export default App;
