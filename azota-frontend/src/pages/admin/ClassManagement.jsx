
import { useMemo, useState } from "react";
import {
  Plus, Search, Pencil, Eye, LockKeyhole,
  LockKeyholeOpen, X,
} from "lucide-react";
import {
  getClasses,
  saveClass,
  toggleClassStatus,
} from "../../services/classManagementService";
import "../../styles/ClassManagement.css";

const blank = {
  classCode: "",
  subjectCode: "",
  subjectName: "",
  teacher: "",
  studentCount: 0,
  semester: "HK1",
  status: "ACTIVE",
};

export default function ClassManagement() {
  const [classes, setClasses] = useState(getClasses);
  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return classes.filter((c) => (
      [c.classCode, c.subjectCode, c.subjectName, c.teacher]
        .some((value) => (value || "").toLowerCase().includes(q)) &&
      (semester === "ALL" || c.semester === semester) &&
      (status === "ALL" || c.status === status)
    ));
  }, [classes, search, semester, status]);

  function close() {
    setModal(null);
    setSelected(null);
    setError("");
  }

  function openCreate() {
    setForm({ ...blank });
    setSelected(null);
    setError("");
    setModal("create");
  }

  function openEdit(item) {
    setSelected(item);
    setForm({ ...item });
    setError("");
    setModal("edit");
  }

  function openDetail(item) {
    setSelected(item);
    setModal("detail");
  }

  function openToggle(item) {
    setSelected(item);
    setModal("toggle");
  }

  function submit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      classCode: form.classCode.trim(),
      subjectCode: form.subjectCode.trim(),
      subjectName: form.subjectName.trim(),
      teacher: form.teacher.trim(),
      studentCount: Number(form.studentCount),
    };

    if (
      !payload.classCode || !payload.subjectCode ||
      !payload.subjectName || !payload.teacher
    ) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (
      !Number.isInteger(payload.studentCount) ||
      payload.studentCount < 0
    ) {
      setError("Sĩ số phải là số nguyên không âm.");
      return;
    }

    try {
      saveClass(payload, selected?.id);
      setClasses(getClasses());
      close();
    } catch (err) {
      setError(err.message);
    }
  }

  function confirmToggle() {
    try {
      toggleClassStatus(selected.id);
      setClasses(getClasses());
      close();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="cm-page">
      <div className="cm-heading">
        <div>
          <h1>Quản lý lớp học</h1>
          <p>Tổng lớp học</p>
          <strong>{classes.length}</strong>
        </div>
        <button className="cm-add" onClick={openCreate}>
          <Plus size={18} /> Thêm lớp
        </button>
      </div>

      <div className="cm-panel">
        <div className="cm-search">
          <Search size={17} />
          <input
            placeholder="Tìm theo mã lớp, tên môn, giảng viên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="cm-filters">
          <label>
            Học kỳ
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="ALL">Tất cả học kỳ</option>
              <option value="HK1">HK1</option>
              <option value="HK2">HK2</option>
              <option value="HK3">HK3</option>
            </select>
          </label>
          <label>
            Trạng thái
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="LOCKED">Đã khóa</option>
            </select>
          </label>
        </div>

        <div className="cm-scroll">
          <table className="cm-table">
            <thead>
              <tr>
                <th>Mã lớp</th>
                <th>Môn học</th>
                <th>Giảng viên</th>
                <th>Sĩ số</th>
                <th>Học kỳ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.classCode}</td>
                  <td>{item.subjectName}</td>
                  <td>{item.teacher}</td>
                  <td>{item.studentCount}</td>
                  <td>{item.semester}</td>
                  <td>
                    <div className="cm-actions">
                      <button title="Sửa" onClick={() => openEdit(item)}>
                        <Pencil size={16} />
                      </button>
                      <button
                        title={item.status === "ACTIVE"
                          ? "Khóa lớp" : "Mở khóa lớp"}
                        onClick={() => openToggle(item)}
                      >
                        {item.status === "ACTIVE"
                          ? <LockKeyhole size={16} />
                          : <LockKeyholeOpen size={16} />}
                      </button>
                      <button title="Chi tiết" onClick={() => openDetail(item)}>
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="cm-empty">
                  Không tìm thấy lớp học.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="cm-backdrop">
          <div className="cm-modal" role="dialog" aria-modal="true">
            <div className="cm-modal-head">
              <h2>
                {modal === "create" ? "Thêm lớp học" :
                  modal === "edit" ? "Chỉnh sửa lớp học" :
                  modal === "detail" ? "Chi tiết lớp học" :
                  selected?.status === "ACTIVE"
                    ? "Khóa lớp học" : "Mở khóa lớp học"}
              </h2>
              <button onClick={close}><X size={20} /></button>
            </div>

            {["create", "edit"].includes(modal) && (
              <form onSubmit={submit}>
                {[
                  ["classCode", "Mã lớp", "text"],
                  ["subjectCode", "Mã môn học", "text"],
                  ["subjectName", "Tên môn học", "text"],
                  ["teacher", "Giảng viên", "text"],
                  ["studentCount", "Sĩ số", "number"],
                ].map(([name, label, type]) => (
                  <label key={name}>
                    {label}
                    <input
                      name={name}
                      type={type}
                      min={type === "number" ? 0 : undefined}
                      value={form[name]}
                      onChange={(e) => setForm({
                        ...form, [name]: e.target.value,
                      })}
                      required
                    />
                  </label>
                ))}
                <label>
                  Học kỳ
                  <select
                    value={form.semester}
                    onChange={(e) => setForm({
                      ...form, semester: e.target.value,
                    })}
                  >
                    <option>HK1</option>
                    <option>HK2</option>
                    <option>HK3</option>
                  </select>
                </label>
                <label>
                  Trạng thái
                  <select
                    value={form.status}
                    onChange={(e) => setForm({
                      ...form, status: e.target.value,
                    })}
                  >
                    <option value="ACTIVE">Hoạt động</option>
                    <option value="LOCKED">Đã khóa</option>
                  </select>
                </label>
                {error && <p className="cm-error">{error}</p>}
                <div className="cm-footer">
                  <button type="button" onClick={close}>Hủy</button>
                  <button className="cm-primary" type="submit">Lưu</button>
                </div>
              </form>
            )}

            {modal === "detail" && selected && (
              <>
                <div className="cm-details">
                  <p><b>Mã lớp:</b> {selected.classCode}</p>
                  <p><b>Môn học:</b> {selected.subjectName}</p>
                  <p><b>Mã môn:</b> {selected.subjectCode}</p>
                  <p><b>Giảng viên:</b> {selected.teacher}</p>
                  <p><b>Sĩ số:</b> {selected.studentCount}</p>
                  <p><b>Học kỳ:</b> {selected.semester}</p>
                  <p><b>Trạng thái:</b> {
                    selected.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"
                  }</p>
                </div>
                <div className="cm-footer">
                  <button onClick={close}>Đóng</button>
                </div>
              </>
            )}

            {modal === "toggle" && selected && (
              <>
                <p>
                  Bạn có chắc muốn{" "}
                  {selected.status === "ACTIVE" ? "khóa" : "mở khóa"}{" "}
                  lớp <b>{selected.classCode}</b>?
                </p>
                {error && <p className="cm-error">{error}</p>}
                <div className="cm-footer">
                  <button onClick={close}>Hủy</button>
                  <button className="cm-primary" onClick={confirmToggle}>
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
