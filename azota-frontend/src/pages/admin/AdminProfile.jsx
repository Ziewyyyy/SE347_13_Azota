
import { useState } from "react";
import {
  UserRound,
  Pencil,
  LockKeyhole,
  X,
  CheckCircle2,
} from "lucide-react";

import {
  getAdminProfile,
  updateAdminProfile,
} from "../../services/adminProfileService";

import "../../styles/AdminProfile.css";

export default function AdminProfile() {
  const [profile, setProfile] = useState(getAdminProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: profile.fullName,
    email: profile.email,
  });

  const [passwordModal, setPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function startEdit() {
    setForm({
      fullName: profile.fullName,
      email: profile.email,
    });
    setError("");
    setMessage("");
    setEditing(true);
  }

  function saveProfile(e) {
    e.preventDefault();
    setError("");

    try {
      const updated = updateAdminProfile(form);
      setProfile(updated);
      setEditing(false);
      setMessage("Cập nhật thông tin thành công.");
    } catch (err) {
      setError(err.message);
    }
  }

  function changePassword(e) {
    e.preventDefault();
    setError("");

    if (passwords.next.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (passwords.next !== passwords.confirm) {
      setError("Xác nhận mật khẩu không khớp.");
      return;
    }

    // Mock: chưa có API xác thực mật khẩu hiện tại.
    setPasswordModal(false);
    setPasswords({ current: "", next: "", confirm: "" });
    setMessage(
      "Đã kiểm tra biểu mẫu. Chức năng đổi mật khẩu " +
      "sẽ hoạt động khi kết nối backend."
    );
  }

  return (
    <div className="ap-page">
      <h1>Hồ sơ cá nhân</h1>

      <div className="ap-identity">
        <div className="ap-avatar">
          <UserRound size={54} strokeWidth={1.2} />
        </div>

        <div>
          <h2>{profile.fullName}</h2>
          <span className="ap-role">Admin</span>
        </div>
      </div>

      <section className="ap-card">
        <div className="ap-card-header">
          <h2>Thông tin cá nhân</h2>

          {!editing && (
            <button className="ap-edit-btn" onClick={startEdit}>
              <Pencil size={15} />
              Chỉnh sửa
            </button>
          )}
        </div>

        <form onSubmit={saveProfile}>
          <label>
            Họ và tên
            <input
              value={editing ? form.fullName : profile.fullName}
              disabled={!editing}
              onChange={(e) => setForm({
                ...form,
                fullName: e.target.value,
              })}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={editing ? form.email : profile.email}
              disabled={!editing}
              onChange={(e) => setForm({
                ...form,
                email: e.target.value,
              })}
              required
            />
          </label>

          <div className="ap-two-columns">
            <label>
              Mã người dùng
              <input value={profile.userId} disabled />
            </label>

            <label>
              Vai trò
              <input value="Admin" disabled />
            </label>
          </div>

          <div className="ap-status-row">
            <div>
              <span className="ap-status-label">
                Trạng thái tài khoản
              </span>
              <div className="ap-active">
                <CheckCircle2 size={16} />
                Đang hoạt động
              </div>
            </div>

            <button
              type="button"
              className="ap-password-btn"
              onClick={() => {
                setError("");
                setPasswordModal(true);
              }}
            >
              <LockKeyhole size={15} />
              Đổi mật khẩu
            </button>
          </div>

          {error && !passwordModal && (
            <p className="ap-error">{error}</p>
          )}

          {editing && (
            <div className="ap-form-actions">
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setError("");
                }}
              >
                Hủy
              </button>
              <button type="submit" className="ap-primary">
                Lưu thay đổi
              </button>
            </div>
          )}
        </form>
      </section>

      {message && (
        <p className="ap-success" role="status">{message}</p>
      )}

      {passwordModal && (
        <div className="ap-backdrop">
          <div className="ap-modal" role="dialog" aria-modal="true">
            <div className="ap-modal-header">
              <h2>Đổi mật khẩu</h2>
              <button
                onClick={() => {
                  setPasswordModal(false);
                  setError("");
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={changePassword}>
              <label>
                Mật khẩu hiện tại
                <input
                  type="password"
                  value={passwords.current}
                  onChange={(e) => setPasswords({
                    ...passwords,
                    current: e.target.value,
                  })}
                  required
                />
              </label>

              <label>
                Mật khẩu mới
                <input
                  type="password"
                  value={passwords.next}
                  onChange={(e) => setPasswords({
                    ...passwords,
                    next: e.target.value,
                  })}
                  required
                />
              </label>

              <label>
                Xác nhận mật khẩu mới
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({
                    ...passwords,
                    confirm: e.target.value,
                  })}
                  required
                />
              </label>

              {error && <p className="ap-error">{error}</p>}

              <div className="ap-form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModal(false);
                    setError("");
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className="ap-primary">
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
