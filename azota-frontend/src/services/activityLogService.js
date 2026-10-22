
const KEY = "azota_admin_activity_logs";

const initialLogs = [
  {
    id: "LOG001",
    user: "Nguyễn Văn An",
    action: "Tạo mới",
    actionType: "CREATE",
    target: "Tài khoản SV001",
    time: "2026-10-13T14:32:00",
    detail: "Tạo tài khoản sinh viên SV001",
  },
  {
    id: "LOG002",
    user: "Trần Thị Lan",
    action: "Cập nhật",
    actionType: "UPDATE",
    target: "Bài thi SE104",
    time: "2026-10-13T14:15:00",
    detail: "Cập nhật thông tin bài thi SE104",
  },
  {
    id: "LOG003",
    user: "Lê Minh Khoa",
    action: "Đăng nhập",
    actionType: "LOGIN",
    target: "Hệ thống",
    time: "2026-10-13T13:50:00",
    detail: "Đăng nhập vào hệ thống",
  },
  {
    id: "LOG004",
    user: "Lê Minh Khoa",
    action: "Khóa tài khoản",
    actionType: "LOCK",
    target: "Tài khoản GV001",
    time: "2026-10-12T10:30:00",
    detail: "Khóa tài khoản giảng viên GV001",
  },
  {
    id: "LOG005",
    user: "Nguyễn Văn An",
    action: "Tạo mới",
    actionType: "CREATE",
    target: "Lớp SE104.021",
    time: "2026-10-11T09:15:00",
    detail: "Tạo lớp học SE104.021",
  },
];

export function getActivityLogs() {
  try {
    const saved = localStorage.getItem(KEY);

    if (!saved) {
      localStorage.setItem(KEY, JSON.stringify(initialLogs));
      return [...initialLogs];
    }

    const data = JSON.parse(saved);
    return Array.isArray(data) ? data : [...initialLogs];
  } catch {
    return [...initialLogs];
  }
}

// Có thể gọi khi các chức năng Admin thực hiện thao tác.
export function addActivityLog({
  user,
  action,
  actionType,
  target,
  detail,
}) {
  const logs = getActivityLogs();

  const newLog = {
    id: crypto.randomUUID(),
    user,
    action,
    actionType,
    target,
    detail,
    time: new Date().toISOString(),
  };

  localStorage.setItem(
    KEY,
    JSON.stringify([newLog, ...logs])
  );

  return newLog;
}
