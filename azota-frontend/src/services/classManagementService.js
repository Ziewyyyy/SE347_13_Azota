
/* src/services/classManagementService.js */

const KEY = "azota_admin_classes";

const initialClasses = [
  {
    id: "C001",
    classCode: "SE104.021",
    subjectCode: "SE104",
    subjectName: "Nhập môn công nghệ phần mềm",
    teacher: "Nguyễn Văn Minh",
    studentCount: 45,
    semester: "HK1",
    status: "ACTIVE",
  },
  {
    id: "C002",
    classCode: "IT003.022",
    subjectCode: "IT003",
    subjectName: "Cấu trúc dữ liệu và giải thuật",
    teacher: "Trần Thị Lan",
    studentCount: 52,
    semester: "HK2",
    status: "ACTIVE",
  },
];

export function getClasses() {
  try {
    const saved = localStorage.getItem(KEY);
    if (!saved) {
      localStorage.setItem(KEY, JSON.stringify(initialClasses));
      return [...initialClasses];
    }
    const data = JSON.parse(saved);
    return Array.isArray(data) ? data : [...initialClasses];
  } catch {
    return [...initialClasses];
  }
}

function saveClasses(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function saveClass(payload, id = null) {
  const classes = getClasses();

  if (
    classes.some(
      (item) =>
        item.classCode.toLowerCase() ===
          payload.classCode.toLowerCase() &&
        item.id !== id
    )
  ) {
    throw new Error("Mã lớp đã tồn tại.");
  }

  if (id) {
    const index = classes.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Không tìm thấy lớp học.");
    classes[index] = { ...classes[index], ...payload, id };
  } else {
    classes.push({
      ...payload,
      id: crypto.randomUUID(),
    });
  }

  saveClasses(classes);
}

export function toggleClassStatus(id) {
  const classes = getClasses();
  const item = classes.find((c) => c.id === id);

  if (!item) throw new Error("Không tìm thấy lớp học.");

  item.status =
    item.status === "ACTIVE" ? "LOCKED" : "ACTIVE";

  saveClasses(classes);
}
