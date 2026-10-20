
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  School,
  ClipboardList,
  BookOpen,
  FileCheck,
  CheckCheck,
  BarChart3,
  Bell,
  UserRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import LogoutModal from "./LogoutModal";

const menuItems = [
  { label: "Tổng quan", icon: LayoutDashboard, path: "/teacher" },
  { label: "Lớp học", icon: School, path: "/teacher/classes" },
  { label: "Bài tập", icon: ClipboardList, path: "/teacher/assignments" },
  { label: "Ngân hàng câu hỏi", icon: BookOpen, path: "/teacher/questions" },
  { label: "Bài kiểm tra", icon: FileCheck, path: "/teacher/exams" },
  { label: "Chấm điểm", icon: CheckCheck, path: "/teacher/grading" },
  { label: "Thống kê", icon: BarChart3, path: "/teacher/statistics" },
  { label: "Thông báo", icon: Bell, path: "/teacher/notifications" },
  { label: "Hồ sơ cá nhân", icon: UserRound, path: "/teacher/profile" },
];

export default function TeacherSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setError("");
      await logout();
      setShowLogoutModal(false);
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.message || "Đăng xuất thất bại");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <button
        className="teacher-mobile-menu"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mở menu"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isOpen && (
        <div
          className="teacher-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`teacher-sidebar ${isOpen ? "open" : ""}`}>
        <div className="teacher-brand">
          <GraduationCap size={30} />
          <span>Azota</span>
        </div>

        <div className="teacher-menu-title">GIẢNG VIÊN</div>

        <nav className="teacher-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                className={`teacher-menu-item ${active ? "active" : ""}`}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
              >
                <Icon size={20} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          className="teacher-logout"
          disabled={loggingOut}
          onClick={() => setShowLogoutModal(true)}
        >
          <LogOut size={19} />
          <span>Đăng xuất</span>
        </button>
      </aside>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={loggingOut}
      />

      {error && (
        <div className="teacher-logout-error" role="alert">
          {error}
        </div>
      )}
    </>
  );
}
