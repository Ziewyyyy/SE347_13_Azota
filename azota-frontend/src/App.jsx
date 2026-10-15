import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

function LoginRoute() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginPage />;
}

function DashboardRedirect() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  return <DashboardPage />;
}

function AdminPlaceholder() {
  const location = useLocation();

  const titles = {
    "/admin/users": "Người dùng",
    "/admin/students": "Sinh viên",
    "/admin/teachers": "Giảng viên",
    "/admin/subjects": "Môn học",
    "/admin/classes": "Lớp học",
    "/admin/logs": "Nhật ký",
  };

  return (
    <div>
      <h1>{titles[location.pathname] || "Trang quản lý"}</h1>
      <p>Chức năng đang được phát triển.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />

          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={<DashboardRedirect />}
            />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminPlaceholder />} />
              <Route path="students" element={<AdminPlaceholder />} />
              <Route path="teachers" element={<AdminPlaceholder />} />
              <Route path="subjects" element={<AdminPlaceholder />} />
              <Route path="classes" element={<AdminPlaceholder />} />
              <Route path="logs" element={<AdminPlaceholder />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}