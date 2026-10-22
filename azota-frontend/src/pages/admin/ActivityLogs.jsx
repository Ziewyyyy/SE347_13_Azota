
import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  X,
  RotateCcw,
} from "lucide-react";

import { getActivityLogs } from "../../services/activityLogService";
import "../../styles/ActivityLogs.css";

function formatTime(value) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getLocalDate(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ActivityLogs() {
  const [logs] = useState(getActivityLogs);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("ALL");
  const [user, setUser] = useState("ALL");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState(null);

  const users = [...new Set(logs.map((log) => log.user))];

  const filtered = useMemo(() => {
    const keyword = search.trim().toLocaleLowerCase("vi-VN");

    return logs
      .filter((log) => {
        const matchesSearch = [
          log.user,
          log.action,
          log.target,
          log.detail,
        ].some((value) =>
          (value || "")
            .toLocaleLowerCase("vi-VN")
            .includes(keyword)
        );

        return (
          matchesSearch &&
          (action === "ALL" || log.actionType === action) &&
          (user === "ALL" || log.user === user) &&
          (!date || getLocalDate(log.time) === date)
        );
      })
      .sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [logs, search, action, user, date]);

  function clearFilters() {
    setSearch("");
    setAction("ALL");
    setUser("ALL");
    setDate("");
  }

  return (
    <div className="al-page">
      <div className="al-heading">
        <h1>Nhật ký hoạt động</h1>
        <p>Tổng bản ghi</p>
        <strong>{logs.length}</strong>
      </div>

      <div className="al-panel">
        <div className="al-search">
          <Search size={17} />
          <input
            placeholder="Tìm kiếm theo người thực hiện, hành động..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="al-filters">
          <label>
            Hành động
            <select
              value={action}
              onChange={(e) => setAction(e.target.value)}
            >
              <option value="ALL">Tất cả hành động</option>
              <option value="CREATE">Tạo mới</option>
              <option value="UPDATE">Cập nhật</option>
              <option value="LOGIN">Đăng nhập</option>
              <option value="LOCK">Khóa tài khoản</option>
            </select>
          </label>

          <label>
            Người thực hiện
            <select
              value={user}
              onChange={(e) => setUser(e.target.value)}
            >
              <option value="ALL">Tất cả người dùng</option>
              {users.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </label>

          <label>
            Từ ngày
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <button className="al-clear" onClick={clearFilters}>
            <RotateCcw size={15} />
            Xóa lọc
          </button>
        </div>

        <div className="al-scroll">
          <table className="al-table">
            <thead>
              <tr>
                <th>Người thực hiện</th>
                <th>Hành động</th>
                <th>Đối tượng</th>
                <th>Thời gian</th>
                <th>Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((log) => (
                <tr key={log.id}>
                  <td><strong>{log.user}</strong></td>
                  <td>
                    <span className={`al-action ${log.actionType}`}>
                      {log.action}
                    </span>
                  </td>
                  <td>{log.target}</td>
                  <td>{formatTime(log.time)}</td>
                  <td>
                    <button
                      className="al-view"
                      title="Xem chi tiết"
                      onClick={() => setSelected(log)}
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="al-empty">
                    Không có bản ghi phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="al-backdrop">
          <div className="al-modal" role="dialog" aria-modal="true">
            <div className="al-modal-head">
              <h2>Chi tiết nhật ký</h2>
              <button onClick={() => setSelected(null)}>
                <X size={20} />
              </button>
            </div>

            <p><b>Người thực hiện:</b> {selected.user}</p>
            <p><b>Hành động:</b> {selected.action}</p>
            <p><b>Đối tượng:</b> {selected.target}</p>
            <p><b>Thời gian:</b> {formatTime(selected.time)}</p>
            <p><b>Nội dung:</b> {selected.detail}</p>

            <div className="al-modal-footer">
              <button onClick={() => setSelected(null)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
