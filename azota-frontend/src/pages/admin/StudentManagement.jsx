
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
  getStudents,
  createStudent,
  updateStudent,
  toggleStudentLock,
} from "../../services/studentManagementService";

import "../../styles/StudentManagement.css";

const facultyOptions = [
  "Công nghệ phần mềm",
  "Khoa học máy tính",
  "Hệ thống thông tin",
  "Mạng máy tính và Truyền thông",
  "Kỹ thuật máy tính",
  "Khoa học và Kỹ thuật thông tin",
];

const emptyForm = {
  studentCode: "",
  fullName: "",
  email: "",
  className: "",
  faculty: "Công nghệ phần mềm",
  status: "ACTIVE",
};

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [modal, setModal] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  async function loadStudents() {
    const data = await getStudents();
    setStudents(data);
  }

  useEffect(() => {
    getStudents().then(setStudents);
  }, []);

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi-VN");

    return students.filter((student) => {
      const matchesSearch = [
        student.fullName,
        student.studentCode,
        student.email,
      ].some((value) =>
        (value || "").toLocaleLowerCase("vi-VN").includes(keyword)
      );

      const matchesFaculty =
        facultyFilter === "ALL" ||
        student.faculty === facultyFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        student.status === statusFilter;

      return matchesSearch && matchesFaculty && matchesStatus;
    });
  }, [students, search, facultyFilter, statusFilter]);

  function closeModal() {
    setModal(null);
    setSelectedStudent(null);
    setError("");
  }

  function openCreate() {
    setSelectedStudent(null);
    setForm({ ...emptyForm });
    setError("");
    setModal("create");
  }

  function openEdit(student) {
    setSelectedStudent(student);
    setForm({
      studentCode: student.studentCode,
      fullName: student.fullName,
      email: student.email,
      className: student.className,
      faculty: student.faculty,
      status: student.status,
    });
    setError("");
    setModal("edit");
  }

  function openDetail(student) {
    setSelectedStudent(student);
    setModal("detail");
  }

  function openLock(student) {
    setSelectedStudent(student);
    setError("");
    setModal("lock");
  }

  function handleChange(event) {
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
      studentCode: form.studentCode.trim(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      className: form.className.trim(),
    };

    if (
      !payload.studentCode ||
      !payload.fullName ||
      !payload.email ||
      !payload.className
    ) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      if (modal === "create") {
        await createStudent(payload);
      } else {
        await updateStudent(selectedStudent.id, payload);
      }

      await loadStudents();
      closeModal();
    } catch (err) {
      setError(err.message || "Không thể lưu sinh viên.");
    }
  }

  async function handleToggleLock() {
    if (!selectedStudent) return;

    try {
      await toggleStudentLock(selectedStudent.id);
      await loadStudents();
      closeModal();
    } catch (err) {
      setError(err.message || "Không thể cập nhật trạng thái.");
    }
  }

  return (
    <div className="sm-page">
      <div className="sm-heading">
        <div>
          <h1>Quản lý sinh viên</h1>
          <p>Tổng sinh viên</p>
          <strong className="sm-count">{students.length}</strong>
        </div>

        <button className="sm-add-btn" onClick={openCreate}>
          <Plus size={19} />
          Thêm sinh viên
        </button>
      </div>

      <div className="sm-panel">
        <div className="sm-search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên, MSSV, email..."
            aria-label="Tìm kiếm sinh viên"
          />
        </div>

        <div className="sm-filters">
          <div>
            <label htmlFor="sm-faculty">Khoa</label>
            <select
              id="sm-faculty"
              value={facultyFilter}
              onChange={(event) =>
                setFacultyFilter(event.target.value)
              }
            >
              <option value="ALL">Tất cả khoa</option>
              {facultyOptions.map((faculty) => (
                <option key={faculty} value={faculty}>
                  {faculty}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sm-status">Trạng thái</label>
            <select
              id="sm-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="LOCKED">Đã khóa</option>
            </select>
          </div>
        </div>

        <div className="sm-table-wrapper">
          <table className="sm-table">
            <thead>
              <tr>
                <th>Sinh viên</th>
                <th>Mã SV</th>
                <th>Lớp</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <strong>{student.fullName}</strong>
                  </td>

                  <td>{student.studentCode}</td>

                  <td>{student.className}</td>

                  <td>
                    <span
                      className={`sm-status ${
                        student.status === "ACTIVE"
                          ? "active"
                          : "locked"
                      }`}
                    >
                      {student.status === "ACTIVE"
                        ? "Hoạt động"
                        : "Đã khóa"}
                    </span>
                  </td>

                  <td>
                    <div className="sm-actions">
                      <button
                        title="Chỉnh sửa"
                        aria-label={`Sửa ${student.fullName}`}
                        onClick={() => openEdit(student)}
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        title={
                          student.status === "ACTIVE"
                            ? "Khóa tài khoản"
                            : "Mở khóa tài khoản"
                        }
                        aria-label={`Đổi trạng thái ${student.fullName}`}
                        onClick={() => openLock(student)}
                      >
                        {student.status === "ACTIVE" ? (
                          <LockKeyhole size={17} />
                        ) : (
                          <LockKeyholeOpen size={17} />
                        )}
                      </button>

                      <button
                        title="Xem chi tiết"
                        aria-label={`Xem ${student.fullName}`}
                        onClick={() => openDetail(student)}
                      >
                        <Eye size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={5} className="sm-empty">
                    Không tìm thấy sinh viên phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === "create" || modal === "edit") && (
        <div className="sm-modal-backdrop">
          <div className="sm-modal" role="dialog" aria-modal="true">
            <div className="sm-modal-header">
              <h2>
                {modal === "create"
                  ? "Thêm sinh viên"
                  : "Chỉnh sửa sinh viên"}
              </h2>
              <button onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <label>
                Mã sinh viên
                <input
                  name="studentCode"
                  value={form.studentCode}
                  onChange={handleChange}
                  placeholder="Ví dụ: 22520003"
                  required
                />
              </label>

              <label>
                Họ và tên
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ tên sinh viên"
                  required
                />
              </label>

              <label>
                Email
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="example@student.uit.edu.vn"
                  required
                />
              </label>

              <label>
                Lớp
                <input
                  name="className"
                  value={form.className}
                  onChange={handleChange}
                  placeholder="Ví dụ: SE01"
                  required
                />
              </label>

              <label>
                Khoa
                <select
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                >
                  {facultyOptions.map((faculty) => (
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
                  onChange={handleChange}
                >
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="LOCKED">Đã khóa</option>
                </select>
              </label>

              {error && <p className="sm-error">{error}</p>}

              <div className="sm-modal-footer">
                <button type="button" onClick={closeModal}>
                  Hủy
                </button>
                <button type="submit" className="sm-primary">
                  {modal === "create"
                    ? "Thêm sinh viên"
                    : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === "detail" && selectedStudent && (
        <div className="sm-modal-backdrop">
          <div className="sm-modal" role="dialog" aria-modal="true">
            <div className="sm-modal-header">
              <h2>Chi tiết sinh viên</h2>
              <button onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            <div className="sm-details">
              <p><b>MSSV:</b> {selectedStudent.studentCode}</p>
              <p><b>Họ tên:</b> {selectedStudent.fullName}</p>
              <p><b>Email:</b> {selectedStudent.email}</p>
              <p><b>Lớp:</b> {selectedStudent.className}</p>
              <p><b>Khoa:</b> {selectedStudent.faculty}</p>
              <p>
                <b>Trạng thái:</b>{" "}
                {selectedStudent.status === "ACTIVE"
                  ? "Hoạt động"
                  : "Đã khóa"}
              </p>
            </div>

            <div className="sm-modal-footer">
              <button onClick={closeModal}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {modal === "lock" && selectedStudent && (
        <div className="sm-modal-backdrop">
          <div className="sm-modal" role="dialog" aria-modal="true">
            <div className="sm-modal-header">
              <h2>
                {selectedStudent.status === "ACTIVE"
                  ? "Khóa tài khoản"
                  : "Mở khóa tài khoản"}
              </h2>
              <button onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            <p>
              Bạn có chắc muốn{" "}
              {selectedStudent.status === "ACTIVE"
                ? "khóa"
                : "mở khóa"}{" "}
              tài khoản sinh viên{" "}
              <b>{selectedStudent.fullName}</b>?
            </p>

            {error && <p className="sm-error">{error}</p>}

            <div className="sm-modal-footer">
              <button onClick={closeModal}>Hủy</button>
              <button
                className="sm-primary"
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
