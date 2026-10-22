
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Pencil,
  LockKeyhole,
  LockKeyholeOpen,
  Eye,
  X,
  Search,
} from "lucide-react";

import {
  getUsers,
  createUser,
  updateUser,
  toggleUserLock,
} from "../../services/userService";

import "../../styles/UserManagement.css";

const roleLabels = {
  ADMIN: "Admin",
  TEACHER: "Giảng viên",
  STUDENT: "Sinh viên",
};

const statusLabels = {
  ACTIVE: "Hoạt động",
  LOCKED: "Đã khóa",
};

const emptyForm = {
  code: "",
  fullName: "",
  email: "",
  role: "STUDENT",
  status: "ACTIVE",
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [modal, setModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi-VN");

    return users.filter((user) => {
      const matchesSearch =
        user.fullName.toLocaleLowerCase("vi-VN").includes(keyword) ||
        user.code.toLocaleLowerCase("vi-VN").includes(keyword);

      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "ALL" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  function openCreate() {
    setForm({ ...emptyForm });
    setSelectedUser(null);
    setError("");
    setModal("create");
  }

  function openEdit(user) {
    setSelectedUser(user);
    setForm({
      code: user.code,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setError("");
    setModal("edit");
  }

  function openDetail(user) {
    setSelectedUser(user);
    setModal("detail");
  }

  function openLock(user) {
    setSelectedUser(user);
    setModal("lock");
  }

  function closeModal() {
    setModal(null);
    setSelectedUser(null);
    setError("");
  }

  function changeField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");

    const payload = {
      ...form,
      code: form.code.trim(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
    };

    if (!payload.code || !payload.fullName || !payload.email) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    const duplicateCode = users.some(
      (user) =>
        user.code.toLowerCase() === payload.code.toLowerCase() &&
        user.id !== selectedUser?.id
    );

    if (duplicateCode) {
      setError("Mã người dùng đã tồn tại.");
      return;
    }

    try {
      if (modal === "create") {
        await createUser(payload);
      } else {
        await updateUser(selectedUser.id, payload);
      }

      setUsers(await getUsers());
      closeModal();
    } catch (err) {
      setError(err.message || "Không thể lưu người dùng.");
    }
  }

  async function handleToggleLock() {
    if (!selectedUser) return;

    try {
      await toggleUserLock(selectedUser.id);
      setUsers(await getUsers());
      closeModal();
    } catch (err) {
      setError(err.message || "Không thể cập nhật trạng thái.");
    }
  }

  return (
    <div className="um-page">
      <div className="um-heading">
        <div>
          <h1>Quản lý người dùng</h1>
          <p>Tổng tài khoản</p>
          <strong className="um-count">{users.length}</strong>
        </div>

        <button className="um-add-btn" onClick={openCreate}>
          <Plus size={19} />
          Thêm người dùng
        </button>
      </div>

      <div className="um-panel">
        <div className="um-search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên hoặc mã số..."
            aria-label="Tìm kiếm người dùng"
          />
        </div>

        <div className="um-filters">
          <div>
            <label htmlFor="um-role">Vai trò</label>
            <select
              id="um-role"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="STUDENT">Sinh viên</option>
              <option value="TEACHER">Giảng viên</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="um-status">Trạng thái</label>
            <select
              id="um-status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="LOCKED">Đã khóa</option>
            </select>
          </div>
        </div>

        <div className="um-table-wrapper">
          <table className="um-table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <strong>{user.fullName}</strong>
                  </td>

                  <td>{roleLabels[user.role]}</td>

                  <td>
                    <span
                      className={`um-status ${
                        user.status === "ACTIVE"
                          ? "active"
                          : "locked"
                      }`}
                    >
                      {statusLabels[user.status]}
                    </span>
                  </td>

                  <td>
                    <div className="um-actions">
                      <button
                        title="Chỉnh sửa"
                        aria-label={`Chỉnh sửa ${user.fullName}`}
                        onClick={() => openEdit(user)}
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        title={
                          user.status === "ACTIVE"
                            ? "Khóa tài khoản"
                            : "Mở khóa tài khoản"
                        }
                        aria-label={`Đổi trạng thái ${user.fullName}`}
                        onClick={() => openLock(user)}
                      >
                        {user.status === "ACTIVE" ? (
                          <LockKeyhole size={17} />
                        ) : (
                          <LockKeyholeOpen size={17} />
                        )}
                      </button>

                      <button
                        title="Xem chi tiết"
                        aria-label={`Xem ${user.fullName}`}
                        onClick={() => openDetail(user)}
                      >
                        <Eye size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="um-empty">
                    Không tìm thấy người dùng phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === "create" || modal === "edit") && (
        <div className="um-modal-backdrop">
          <div className="um-modal" role="dialog" aria-modal="true">
            <div className="um-modal-header">
              <h2>
                {modal === "create"
                  ? "Thêm người dùng"
                  : "Chỉnh sửa người dùng"}
              </h2>
              <button onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <label>
                Mã người dùng
                <input
                  name="code"
                  value={form.code}
                  onChange={changeField}
                  placeholder="Ví dụ: SV002"
                  required
                />
              </label>

              <label>
                Họ và tên
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={changeField}
                  placeholder="Nhập họ tên"
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={changeField}
                  placeholder="example@email.com"
                  required
                />
              </label>

              <label>
                Vai trò
                <select
                  name="role"
                  value={form.role}
                  onChange={changeField}
                >
                  <option value="STUDENT">Sinh viên</option>
                  <option value="TEACHER">Giảng viên</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </label>

              <label>
                Trạng thái
                <select
                  name="status"
                  value={form.status}
                  onChange={changeField}
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="LOCKED">Đã khóa</option>
                </select>
              </label>

              {error && <p className="um-error">{error}</p>}

              <div className="um-modal-footer">
                <button type="button" onClick={closeModal}>
                  Hủy
                </button>
                <button type="submit" className="um-primary">
                  {modal === "create" ? "Thêm người dùng" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "detail" && selectedUser && (
        <div className="um-modal-backdrop">
          <div className="um-modal" role="dialog" aria-modal="true">
            <div className="um-modal-header">
              <h2>Chi tiết người dùng</h2>
              <button onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            <div className="um-details">
              <p><b>Mã:</b> {selectedUser.code}</p>
              <p><b>Họ tên:</b> {selectedUser.fullName}</p>
              <p><b>Email:</b> {selectedUser.email}</p>
              <p><b>Vai trò:</b> {roleLabels[selectedUser.role]}</p>
              <p>
                <b>Trạng thái:</b>{" "}
                {statusLabels[selectedUser.status]}
              </p>
            </div>

            <div className="um-modal-footer">
              <button onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {modal === "lock" && selectedUser && (
        <div className="um-modal-backdrop">
          <div className="um-modal" role="dialog" aria-modal="true">
            <div className="um-modal-header">
              <h2>
                {selectedUser.status === "ACTIVE"
                  ? "Khóa tài khoản"
                  : "Mở khóa tài khoản"}
              </h2>
              <button onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            <p>
              Bạn có chắc muốn{" "}
              {selectedUser.status === "ACTIVE" ? "khóa" : "mở khóa"}{" "}
              tài khoản <b>{selectedUser.fullName}</b>?
            </p>

            {error && <p className="um-error">{error}</p>}

            <div className="um-modal-footer">
              <button onClick={closeModal}>Hủy</button>
              <button
                className="um-primary"
                onClick={handleToggleLock}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
