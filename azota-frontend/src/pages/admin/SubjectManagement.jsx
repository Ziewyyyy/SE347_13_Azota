
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
  getSubjects,
  createSubject,
  updateSubject,
  toggleSubjectStatus,
} from "../../services/subjectManagementService";

import "../../styles/SubjectManagement.css";

const faculties = [
  "Công nghệ phần mềm",
  "Khoa học máy tính",
  "Hệ thống thông tin",
  "Mạng máy tính và Truyền thông",
  "Kỹ thuật máy tính",
];

const emptyForm = {
  subjectCode: "",
  subjectName: "",
  credits: 3,
  faculty: "Công nghệ phần mềm",
  status: "ACTIVE",
};

export default function SubjectManagement() {
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [facultyFilter, setFacultyFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [modal, setModal] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    getSubjects().then(setSubjects);
  }, []);

  async function refresh() {
    setSubjects(await getSubjects());
  }

  const filteredSubjects = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi-VN");

    return subjects.filter((subject) => {
      const matchesSearch = [
        subject.subjectName,
        subject.subjectCode,
      ].some((value) =>
        (value || "").toLocaleLowerCase("vi-VN").includes(keyword)
      );

      return (
        matchesSearch &&
        (facultyFilter === "ALL" ||
          subject.faculty === facultyFilter) &&
        (statusFilter === "ALL" ||
          subject.status === statusFilter)
      );
    });
  }, [subjects, search, facultyFilter, statusFilter]);

  function closeModal() {
    setModal(null);
    setSelectedSubject(null);
    setError("");
  }

  function openCreate() {
    setForm({ ...emptyForm });
    setSelectedSubject(null);
    setError("");
    setModal("create");
  }

  function openEdit(subject) {
    setSelectedSubject(subject);
    setForm({
      subjectCode: subject.subjectCode,
      subjectName: subject.subjectName,
      credits: subject.credits,
      faculty: subject.faculty,
      status: subject.status,
    });
    setError("");
    setModal("edit");
  }

  function openDetail(subject) {
    setSelectedSubject(subject);
    setError("");
    setModal("detail");
  }

  function openToggle(subject) {
    setSelectedSubject(subject);
    setError("");
    setModal("toggle");
  }

  function changeField(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");

    const payload = {
      ...form,
      subjectCode: form.subjectCode.trim(),
      subjectName: form.subjectName.trim(),
      credits: Number(form.credits),
    };

    if (!payload.subjectCode || !payload.subjectName) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (
      !Number.isInteger(payload.credits) ||
      payload.credits < 1
    ) {
      setError("Số tín chỉ phải là số nguyên dương.");
      return;
    }

    try {
      if (modal === "create") {
        await createSubject(payload);
      } else {
        await updateSubject(selectedSubject.id, payload);
      }

      await refresh();
      closeModal();
    } catch (err) {
      setError(err.message || "Không thể lưu môn học.");
    }
  }

  async function handleToggle() {
    if (!selectedSubject) return;

    try {
      await toggleSubjectStatus(selectedSubject.id);
      await refresh();
      closeModal();
    } catch (err) {
      setError(err.message || "Không thể cập nhật trạng thái.");
    }
  }

  return (
    <div className="sub-page">
      <div className="sub-heading">
        <div>
          <h1>Quản lý môn học</h1>
          <p>Tổng môn học</p>
          <strong className="sub-count">{subjects.length}</strong>
        </div>

        <button className="sub-add-btn" onClick={openCreate}>
          <Plus size={19} />
          Thêm môn học
        </button>
      </div>

      <div className="sub-panel">
        <div className="sub-search-box">
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, mã môn học..."
          />
        </div>

        <div className="sub-filters">
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
              <option value="INACTIVE">Ngừng hoạt động</option>
            </select>
          </label>
        </div>

        <div className="sub-table-wrapper">
          <table className="sub-table">
            <thead>
              <tr>
                <th>Mã môn</th>
                <th>Tên môn học</th>
                <th>Số tín chỉ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject.id}>
                  <td>{subject.subjectCode}</td>
                  <td>{subject.subjectName}</td>
                  <td>{subject.credits}</td>
                  <td>
                    <span
                      className={`sub-status ${
                        subject.status === "ACTIVE"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {subject.status === "ACTIVE"
                        ? "Hoạt động"
                        : "Ngừng hoạt động"}
                    </span>
                  </td>
                  <td>
                    <div className="sub-actions">
                      <button
                        title="Xem chi tiết"
                        onClick={() => openDetail(subject)}
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        title="Chỉnh sửa"
                        onClick={() => openEdit(subject)}
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        title={
                          subject.status === "ACTIVE"
                            ? "Ngừng hoạt động"
                            : "Kích hoạt môn học"
                        }
                        onClick={() => openToggle(subject)}
                      >
                        {subject.status === "ACTIVE" ? (
                          <LockKeyhole size={17} />
                        ) : (
                          <LockKeyholeOpen size={17} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSubjects.length === 0 && (
                <tr>
                  <td colSpan={5} className="sub-empty">
                    Không tìm thấy môn học phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="sub-modal-backdrop">
          <div className="sub-modal" role="dialog" aria-modal="true">
            <div className="sub-modal-header">
              <h2>
                {modal === "create"
                  ? "Thêm môn học"
                  : modal === "edit"
                    ? "Chỉnh sửa môn học"
                    : modal === "detail"
                      ? "Chi tiết môn học"
                      : selectedSubject?.status === "ACTIVE"
                        ? "Ngừng hoạt động"
                        : "Kích hoạt môn học"}
              </h2>

              <button onClick={closeModal} aria-label="Đóng">
                <X size={20} />
              </button>
            </div>

            {(modal === "create" || modal === "edit") && (
              <form onSubmit={handleSave}>
                <label>
                  Mã môn học
                  <input
                    name="subjectCode"
                    value={form.subjectCode}
                    onChange={changeField}
                    placeholder="Ví dụ: SE101"
                    required
                  />
                </label>

                <label>
                  Tên môn học
                  <input
                    name="subjectName"
                    value={form.subjectName}
                    onChange={changeField}
                    placeholder="Nhập tên môn học"
                    required
                  />
                </label>

                <label>
                  Số tín chỉ
                  <input
                    name="credits"
                    type="number"
                    min="1"
                    step="1"
                    value={form.credits}
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
                    <option value="INACTIVE">
                      Ngừng hoạt động
                    </option>
                  </select>
                </label>

                {error && <p className="sub-error">{error}</p>}

                <div className="sub-modal-footer">
                  <button type="button" onClick={closeModal}>
                    Hủy
                  </button>
                  <button type="submit" className="sub-primary">
                    Lưu
                  </button>
                </div>
              </form>
            )}

            {modal === "detail" && selectedSubject && (
              <>
                <div className="sub-details">
                  <p>
                    <b>Mã môn:</b> {selectedSubject.subjectCode}
                  </p>
                  <p>
                    <b>Tên môn:</b> {selectedSubject.subjectName}
                  </p>
                  <p>
                    <b>Số tín chỉ:</b> {selectedSubject.credits}
                  </p>
                  <p>
                    <b>Khoa:</b> {selectedSubject.faculty}
                  </p>
                  <p>
                    <b>Trạng thái:</b>{" "}
                    {selectedSubject.status === "ACTIVE"
                      ? "Hoạt động"
                      : "Ngừng hoạt động"}
                  </p>
                </div>

                <div className="sub-modal-footer">
                  <button onClick={closeModal}>Đóng</button>
                </div>
              </>
            )}

            {modal === "toggle" && selectedSubject && (
              <>
                <p>
                  Bạn có chắc muốn{" "}
                  {selectedSubject.status === "ACTIVE"
                    ? "ngừng hoạt động"
                    : "kích hoạt"}{" "}
                  môn học <b>{selectedSubject.subjectName}</b>?
                </p>

                {error && <p className="sub-error">{error}</p>}

                <div className="sub-modal-footer">
                  <button onClick={closeModal}>Hủy</button>
                  <button
                    className="sub-primary"
                    onClick={handleToggle}
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
