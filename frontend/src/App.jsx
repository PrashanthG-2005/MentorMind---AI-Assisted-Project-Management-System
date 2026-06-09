import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Layout from "./components/layout/Layout";
import ProjectDetails from "./pages/ProjectDetails";
import Project from "./pages/Project";
import Teams from "./pages/Teams";
import Task from "./pages/Task";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Messages from "./pages/Messages";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { useAuth } from "./context/AuthContext";

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Dashboard Router - chooses between AdminDashboard and Dashboard based on user role
const DashboardRouter = () => {
  const { user } = useAuth();
  
  if (user?.isAdmin) {
    return <AdminDashboard />;
  }
  
  return <Dashboard />;
};

// Admin Route Wrapper - only allows admin users for project,tasks,teams,reports
const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes - Dashboard (common for all) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardRouter />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Admin-only routes: Project, Tasks, Teams, Reports */}
      <Route
        path="/project"
        element={
          <ProtectedRoute>
            <Layout>
              <Project />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teams"
        element={
          <AdminRoute>
            <Layout>
              <Teams />
            </Layout>
          </AdminRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Layout>
              <Task />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <AdminRoute>
            <Layout>
              <Reports />
            </Layout>
          </AdminRoute>
        }
      />
      
      {/* Common routes for all authenticated users */}
      <Route
        path="/project/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ProjectDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <Layout>
              <Calendar />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Layout>
              <Messages />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <Profile />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Redirect to login for any unknown route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
