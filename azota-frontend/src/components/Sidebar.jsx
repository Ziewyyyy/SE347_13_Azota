import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutModal from "./LogoutModal";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Presentation,
    BookOpen,
    School,
    ScrollText,
    LogOut,
    Menu,
    X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const menuItems = [
    { label: "Tổng quan", icon: LayoutDashboard, path: "/admin" },
    { label: "Người dùng", icon: Users, path: "/admin/users" },
    { label: "Sinh viên", icon: GraduationCap, path: "/admin/students" },
    { label: "Giảng viên", icon: Presentation, path: "/admin/teachers" },
    { label: "Môn học", icon: BookOpen, path: "/admin/subjects" },
    { label: "Lớp học", icon: School, path: "/admin/classes" },
    { label: "Nhật ký", icon: ScrollText, path: "/admin/logs" },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const [isOpen, setIsOpen] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            await logout();
            setShowLogoutModal(false);
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <>
            <button
                className="mobile-menu-button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Mở menu"
            >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {isOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-brand">
                    <GraduationCap size={30} />
                    <span>Azota</span>
                </div>

                <div className="sidebar-divider" />

                <nav className="sidebar-menu">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                className={`sidebar-item ${active ? "active" : ""}`}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsOpen(false);
                                }}
                            >
                                <Icon size={20} strokeWidth={1.7} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <button
                    className="sidebar-logout"
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
        </>
    );
}