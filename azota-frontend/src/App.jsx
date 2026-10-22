
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Login
import LoginPage from "./pages/LoginPage";

// Admin
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import StudentManagement from "./pages/admin/StudentManagement";
import TeacherManagement from "./pages/admin/TeacherManagement";
import SubjectManagement from "./pages/admin/SubjectManagement";
import ClassManagement from "./pages/admin/ClassManagement";
import ActivityLogs from "./pages/admin/ActivityLogs";
import AdminProfile from "./pages/admin/AdminProfile";

// Student
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";

// Teacher
import TeacherLayout from "./layouts/TeacherLayout";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

// ==========================================
// LOGIN ROUTE
// ==========================================
function LoginRoute() {
  const { user } = useAuth();

  // Đã đăng nhập thì chuyển về dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LoginPage />;
}

// ==========================================
// DASHBOARD REDIRECT THEO ROLE
// ==========================================
function DashboardRedirect() {
  const { user } = useAuth();

  if (user?.role === "ADMIN") {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === "STUDENT") {
    return <Navigate to="/student" replace />;
  }

  if (user?.role === "TEACHER") {
    return <Navigate to="/teacher" replace />;
  }

  return <Navigate to="/login" replace />;
}

// ==========================================
// ADMIN PLACEHOLDER
// ==========================================
function AdminPlaceholder() {
  const location = useLocation();

  const titles = {
    "/admin/users": "Quản lý người dùng",
    "/admin/students": "Quản lý sinh viên",
    "/admin/teachers": "Quản lý giảng viên",
    "/admin/subjects": "Quản lý môn học",
    "/admin/classes": "Quản lý lớp học",
    "/admin/logs": "Nhật ký hệ thống",
  };

  return (
    <div>
      <h1>{titles[location.pathname] || "Trang quản lý"}</h1>
      <p>Chức năng đang được phát triển.</p>
    </div>
  );
}

// ==========================================
// STUDENT PLACEHOLDER
// ==========================================
function StudentPlaceholder() {
  const location = useLocation();

  const titles = {
    "/student/classes": "Lớp học của tôi",
    "/student/assignments": "Bài tập",
    "/student/exams": "Bài kiểm tra",
    "/student/results": "Kết quả học tập",
    "/student/notifications": "Thông báo",
    "/student/profile": "Hồ sơ cá nhân",
  };

  return (
    <div>
      <h1>{titles[location.pathname] || "Trang sinh viên"}</h1>
      <p>Chức năng đang được phát triển.</p>
    </div>
  );
}

// ==========================================
// TEACHER PLACEHOLDER
// ==========================================
function TeacherPlaceholder() {
  const location = useLocation();

  const titles = {
    "/teacher/classes": "Quản lý lớp học",
    "/teacher/assignments": "Quản lý bài tập",
    "/teacher/questions": "Ngân hàng câu hỏi",
    "/teacher/exams": "Quản lý bài kiểm tra",
    "/teacher/grading": "Chấm điểm",
    "/teacher/statistics": "Thống kê",
    "/teacher/notifications": "Thông báo",
    "/teacher/profile": "Hồ sơ cá nhân",
  };

  return (
    <div>
      <h1>{titles[location.pathname] || "Trang giảng viên"}</h1>
      <p>Chức năng đang được phát triển.</p>
    </div>
  );
}

// ==========================================
// MAIN APP
// ==========================================
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ================= LOGIN ================= */}
          <Route
            path="/login"
            element={<LoginRoute />}
          />

          {/* ================= DASHBOARD REDIRECT ================= */}
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={<DashboardRedirect />}
            />
          </Route>

          {/* ================= ADMIN ROUTES ================= */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]} />
            }
          >
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                index
                element={<AdminDashboard />}
              />

              <Route
                path="users"
                element={<UserManagement />}
              />

              <Route
                path="students"
                element={<StudentManagement />}
              />

              <Route
                path="teachers"
                element={<TeacherManagement />}
              />

              <Route
                path="subjects"
                element={<SubjectManagement />}
              />

              <Route
                path="classes"
                element={<ClassManagement />}
              />

              <Route
                path="logs"
                element={<ActivityLogs />}
              />

              <Route
                path="profile"
                element={<AdminProfile />}
              />
            </Route>
          </Route>

          {/* ================= STUDENT ROUTES ================= */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["STUDENT"]} />
            }
          >
            <Route
              path="/student"
              element={<StudentLayout />}
            >
              <Route
                index
                element={<StudentDashboard />}
              />

              <Route
                path="classes"
                element={<StudentPlaceholder />}
              />

              <Route
                path="assignments"
                element={<StudentPlaceholder />}
              />

              <Route
                path="exams"
                element={<StudentPlaceholder />}
              />

              <Route
                path="results"
                element={<StudentPlaceholder />}
              />

              <Route
                path="notifications"
                element={<StudentPlaceholder />}
              />

              <Route
                path="profile"
                element={<StudentPlaceholder />}
              />
            </Route>
          </Route>

          {/* ================= TEACHER ROUTES ================= */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["TEACHER"]} />
            }
          >
            <Route
              path="/teacher"
              element={<TeacherLayout />}
            >
              <Route
                index
                element={<TeacherDashboard />}
              />

              <Route
                path="classes"
                element={<TeacherPlaceholder />}
              />

              <Route
                path="assignments"
                element={<TeacherPlaceholder />}
              />

              <Route
                path="questions"
                element={<TeacherPlaceholder />}
              />

              <Route
                path="exams"
                element={<TeacherPlaceholder />}
              />

              <Route
                path="grading"
                element={<TeacherPlaceholder />}
              />

              <Route
                path="statistics"
                element={<TeacherPlaceholder />}
              />

              <Route
                path="notifications"
                element={<TeacherPlaceholder />}
              />

              <Route
                path="profile"
                element={<TeacherPlaceholder />}
              />
            </Route>
          </Route>

          {/* ================= DEFAULT ROUTES ================= */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/dashboard" replace />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
