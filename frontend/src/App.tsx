import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import ProtectedRoute from "./components/protectedRoute";
import { useAuth } from "./hooks/auth";

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
        path="/projects"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </ProtectedRoute>
        }
      >
        <Route path="view/:projectId" element={<Home />} />
        <Route path="my" element={<Home />} />
      </Route>

      <Route
        path="/notifications"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
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

      {/* Redirecciona a Home para rutas no definidas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
