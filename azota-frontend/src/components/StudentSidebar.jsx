
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FileCheck,
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
  {
    label: "Tổng quan",
    icon: LayoutDashboard,
    path: "/student",
  },
  {
    label: "Lớp học của tôi",
    icon: BookOpen,
    path: "/student/classes",
  },
  {
    label: "Bài tập",
    icon: ClipboardList,
    path: "/student/assignments",
  },
  {
    label: "Bài kiểm tra",
    icon: FileCheck,
    path: "/student/exams",
  },
  {
    label: "Kết quả học tập",
    icon: BarChart3,
    path: "/student/results",
  },
  {
    label: "Thông báo",
    icon: Bell,
    path: "/student/notifications",
  },
  {
    label: "Hồ sơ cá nhân",
    icon: UserRound,
    path: "/student/profile",
  },
];

export default function StudentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      setLogoutError("");
      await logout();
      setShowLogoutModal(false);
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(error.message || "Đăng xuất thất bại");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <button
        className="student-mobile-menu"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Mở menu"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isOpen && (
        <div
          className="student-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`student-sidebar ${isOpen ? "open" : ""}`}>
        <div className="student-brand">
          <GraduationCap size={30} />
          <span>Azota</span>
        </div>

        <div className="student-menu-title">SINH VIÊN</div>

        <nav className="student-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                className={`student-menu-item ${active ? "active" : ""}`}
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
          className="student-logout"
          onClick={() => setShowLogoutModal(true)}
          disabled={loggingOut}
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

      {logoutError && (
        <div className="student-logout-error" role="alert">
          {logoutError}
        </div>
      )}
    </>
  );
}
