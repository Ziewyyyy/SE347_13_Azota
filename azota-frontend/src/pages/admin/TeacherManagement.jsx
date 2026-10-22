
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
  getTeachers,
  createTeacher,
  updateTeacher,
  toggleTeacherLock,
} from "../../services/teacherManagementService";

import "../../styles/TeacherManagement.css";

const faculties = [
  "Công nghệ phần mềm",
  "Khoa học máy tính",
  "Hệ thống thông tin",
  "Mạng máy tính và Truyền thông",
  "Kỹ thuật máy tính",
];

const emptyForm = {
  teacherCode: "",
  fullName: "",
  email: "",
  faculty: "Công nghệ phần mềm",
  status: "ACTIVE",
};

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [modal, setModal] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    getTeachers().then(setTeachers);
  }, []);

  async function refresh() {
    setTeachers(await getTeachers());
  }

  const filteredTeachers = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi-VN");

    return teachers.filter((teacher) => {
      const matchesSearch = [
        teacher.fullName,
        teacher.teacherCode,
        teacher.email,
      ].some((value) =>
        (value || "").toLocaleLowerCase("vi-VN").includes(keyword)
      );

      return (
        matchesSearch &&
        (facultyFilter === "ALL" ||
          teacher.faculty === facultyFilter) &&
        (statusFilter === "ALL" ||
          teacher.status === statusFilter)
      );
    });
  }, [teachers, search, facultyFilter, statusFilter]);

  function closeModal() {
    setModal(null);
    setSelectedTeacher(null);
    setError("");
  }

  function openCreate() {
    setForm({ ...emptyForm });
    setSelectedTeacher(null);
    setError("");
    setModal("create");
  }

  function openEdit(teacher) {
    setSelectedTeacher(teacher);
    setForm({
      teacherCode: teacher.teacherCode,
      fullName: teacher.fullName,
      email: teacher.email,
      faculty: teacher.faculty,
      status: teacher.status,
    });
    setError("");
    setModal("edit");
  }

  function openDetail(teacher) {
    setSelectedTeacher(teacher);
    setModal("detail");
  }

  function openLock(teacher) {
    setSelectedTeacher(teacher);
    setError("");
    setModal("lock");
  }

  function changeField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");

    const payload = {
      ...form,
      teacherCode: form.teacherCode.trim(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
    };

    if (
      !payload.teacherCode ||
      !payload.fullName ||
      !payload.email
    ) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      if (modal === "create") {
        await createTeacher(payload);
      } else {
        await updateTeacher(selectedTeacher.id, payload);
      }

      await refresh();
      closeModal();
    } catch (err) {
      setError(err.message || "Không thể lưu giảng viên.");
    }
  }

  async function handleToggleLock() {
    try {
      await toggleTeacherLock(selectedTeacher.id);
      await refresh();
      closeModal();
    } catch (err) {
      setError(err.message || "Không thể cập nhật trạng thái.");
    }
  }

  return (
    <div className="tm-page">
      <div className="tm-heading">
        <div>
          <h1>Quản lý giảng viên</h1>
          <p>Tổng giảng viên</p>
          <strong className="tm-count">{teachers.length}</strong>
        </div>

        <button className="tm-add-btn" onClick={openCreate}>
          <Plus size={19} />
          Thêm giảng viên
        </button>
      </div>

      <div className="tm-panel">
        <div className="tm-search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, mã GV, email..."
          />
        </div>

        <div className="tm-filters">
          <label>
            Khoa
            <select
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
            >
              <option value="ALL">Tất cả khoa</option>
              {faculties.map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>
          </label>

          <label>
            Trạng thái
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="LOCKED">Đã khóa</option>
            </select>
          </label>
        </div>

        <div className="tm-table-wrapper">
          <table className="tm-table">
            <thead>
              <tr>
                <th>Giảng viên</th>
                <th>Mã GV</th>
                <th>Khoa</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td><strong>{teacher.fullName}</strong></td>
                  <td>{teacher.teacherCode}</td>
                  <td>{teacher.faculty}</td>
                  <td>
                    <span
                      className={`tm-status ${
                        teacher.status === "ACTIVE"
                          ? "active"
                          : "locked"
                      }`}
                    >
                      {teacher.status === "ACTIVE"
                        ? "Hoạt động"
                        : "Đã khóa"}
                    </span>
                  </td>
                  <td>
                    <div className="tm-actions">
                      <button
                        title="Chỉnh sửa"
                        onClick={() => openEdit(teacher)}
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        title={
                          teacher.status === "ACTIVE"
                            ? "Khóa tài khoản"
                            : "Mở khóa tài khoản"
                        }
                        onClick={() => openLock(teacher)}
                      >
                        {teacher.status === "ACTIVE" ? (
                          <LockKeyhole size={17} />
                        ) : (
                          <LockKeyholeOpen size={17} />
                        )}
                      </button>
                      <button
                        title="Xem chi tiết"
                        onClick={() => openDetail(teacher)}
                      >
                        <Eye size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTeachers.length === 0 && (
                <tr>
                  <td colSpan={5} className="tm-empty">
                    Không tìm thấy giảng viên.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="tm-modal-backdrop">
          <div className="tm-modal" role="dialog" aria-modal="true">
            <div className="tm-modal-header">
              <h2>
                {modal === "create"
                  ? "Thêm giảng viên"
                  : modal === "edit"
                    ? "Chỉnh sửa giảng viên"
                    : modal === "detail"
                      ? "Chi tiết giảng viên"
                      : selectedTeacher?.status === "ACTIVE"
                        ? "Khóa tài khoản"
                        : "Mở khóa tài khoản"}
              </h2>
              <button onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            {(modal === "create" || modal === "edit") && (
              <form onSubmit={handleSave}>
                <label>
                  Mã giảng viên
                  <input
                    name="teacherCode"
                    value={form.teacherCode}
                    onChange={changeField}
                    required
                  />
                </label>

                <label>
                  Họ và tên
                  <input
                    name="fullName"
                    value={form.fullName}
                    onChange={changeField}
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={changeField}
                    required
                  />
                </label>

                <label>
                  Khoa
                  <select
                    name="faculty"
                    value={form.faculty}
                    onChange={changeField}
                  >
                    {faculties.map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
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

                {error && <p className="tm-error">{error}</p>}

                <div className="tm-modal-footer">
                  <button type="button" onClick={closeModal}>
                    Hủy
                  </button>
                  <button type="submit" className="tm-primary">
                    Lưu
                  </button>
                </div>
              </form>
            )}

            {modal === "detail" && selectedTeacher && (
              <>
                <div className="tm-details">
                  <p><b>Mã GV:</b> {selectedTeacher.teacherCode}</p>
                  <p><b>Họ tên:</b> {selectedTeacher.fullName}</p>
                  <p><b>Email:</b> {selectedTeacher.email}</p>
                  <p><b>Khoa:</b> {selectedTeacher.faculty}</p>
                  <p>
                    <b>Trạng thái:</b>{" "}
                    {selectedTeacher.status === "ACTIVE"
                      ? "Hoạt động"
                      : "Đã khóa"}
                  </p>
                </div>
                <div className="tm-modal-footer">
                  <button onClick={closeModal}>Đóng</button>
                </div>
              </>
            )}

            {modal === "lock" && selectedTeacher && (
              <>
                <p>
                  Bạn có chắc muốn{" "}
                  {selectedTeacher.status === "ACTIVE"
                    ? "khóa"
                    : "mở khóa"}{" "}
                  tài khoản <b>{selectedTeacher.fullName}</b>?
                </p>

                {error && <p className="tm-error">{error}</p>}

                <div className="tm-modal-footer">
                  <button onClick={closeModal}>Hủy</button>
                  <button
                    className="tm-primary"
                    onClick={handleToggleLock}
                  >
                    Xác nhận
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
