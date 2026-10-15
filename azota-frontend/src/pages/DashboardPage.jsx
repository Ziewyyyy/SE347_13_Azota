import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const roleNames = {
    STUDENT: "Học sinh",
    TEACHER: "Giáo viên",
    ADMIN: "Quản trị viên",
  };

  const handleLogout = async () => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn đăng xuất?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Azota Dashboard</h1>

      <h2>Xin chào, {user?.fullName}</h2>

      <p>Mã người dùng: {user?.userId}</p>
      <p>Vai trò: {roleNames[user?.role]}</p>

      <button
        onClick={handleLogout}
        disabled={loading}
        style={{
          backgroundColor: "#dc2626",
          color: "white",
          padding: "12px 24px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        {loading ? "Đang đăng xuất..." : "Đăng xuất"}
      </button>
    </div>
  );
}