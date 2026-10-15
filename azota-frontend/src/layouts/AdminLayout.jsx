import { Outlet } from "react-router-dom";
import { CircleUserRound } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import "../styles/AdminDashboard.css";

export default function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-user">
            <span>{user?.fullName || "User"}</span>
            <CircleUserRound size={32} strokeWidth={1.5} />
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}