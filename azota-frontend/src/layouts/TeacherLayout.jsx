
import { Outlet } from "react-router-dom";
import { Bell, CircleUserRound } from "lucide-react";
import TeacherSidebar from "../components/TeacherSidebar";
import { useAuth } from "../context/AuthContext";
import "../styles/TeacherLayout.css";

export default function TeacherLayout() {
  const { user } = useAuth();

  return (
    <div className="teacher-layout">
      <TeacherSidebar />

      <div className="teacher-main">
        <header className="teacher-topbar">
          <div className="teacher-topbar-title">
            Cổng thông tin giảng viên
          </div>

          <div className="teacher-topbar-user">
            <Bell size={21} />
            <span>{user?.fullName || "Giảng viên"}</span>
            <CircleUserRound size={32} strokeWidth={1.5} />
          </div>
        </header>

        <main className="teacher-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
