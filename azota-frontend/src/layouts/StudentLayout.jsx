
import { Outlet } from "react-router-dom";
import { Bell, CircleUserRound } from "lucide-react";
import StudentSidebar from "../components/StudentSidebar";
import { useAuth } from "../context/AuthContext";
import "../styles/StudentLayout.css";

export default function StudentLayout() {
  const { user } = useAuth();

  return (
    <div className="student-layout">
      <StudentSidebar />

      <div className="student-main">
        <header className="student-topbar">
          <div className="student-topbar-title">
            Cổng thông tin sinh viên
          </div>

          <div className="student-topbar-user">
            <Bell size={21} />
            <span>{user?.fullName || "Sinh viên"}</span>
            <CircleUserRound size={32} strokeWidth={1.5} />
          </div>
        </header>

        <main className="student-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
