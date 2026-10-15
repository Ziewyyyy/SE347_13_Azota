import { LogOut, X } from "lucide-react";
import "../styles/LogoutModal.css";

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="logout-overlay"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        className="logout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="logout-close"
          onClick={onClose}
          disabled={loading}
          aria-label="Đóng"
        >
          <X size={20} />
        </button>

        <div className="logout-icon">
          <LogOut size={30} />
        </div>

        <h2 id="logout-title">Xác nhận đăng xuất</h2>

        <p>
          Bạn có chắc chắn muốn đăng xuất khỏi
          hệ thống <strong>Azota</strong> không?
        </p>

        <div className="logout-actions">
          <button
            className="logout-cancel"
            onClick={onClose}
            disabled={loading}
          >
            Hủy
          </button>

          <button
            className="logout-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Đang đăng xuất..." : "Đăng xuất"}
          </button>
        </div>
      </div>
    </div>
  );
}