
const STORAGE_KEY = "azota_admin_teachers";

const initialTeachers = [
  {
    id: "T001",
    teacherCode: "GV001",
    fullName: "Trần Thị Bình",
    email: "binh@uit.edu.vn",
    faculty: "Công nghệ phần mềm",
    status: "ACTIVE",
  },
];

function readTeachers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialTeachers)
      );
      return [...initialTeachers];
    }

    const data = JSON.parse(stored);
    return Array.isArray(data) ? data : [...initialTeachers];
  } catch {
    return [...initialTeachers];
  }
}

function saveTeachers(teachers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
}

export async function getTeachers() {
  return readTeachers();
}

export async function createTeacher(payload) {
  const teachers = readTeachers();

  if (
    teachers.some(
      (item) =>
        item.teacherCode.toLowerCase() ===
        payload.teacherCode.toLowerCase()
    )
  ) {
    throw new Error("Mã giảng viên đã tồn tại.");
  }

  const teacher = {
    ...payload,
    id: crypto.randomUUID(),
  };

  saveTeachers([...teachers, teacher]);
  return teacher;
}

export async function updateTeacher(id, payload) {
  const teachers = readTeachers();
  const index = teachers.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error("Không tìm thấy giảng viên.");
  }

  if (
    teachers.some(
      (item) =>
        item.id !== id &&
        item.teacherCode.toLowerCase() ===
          payload.teacherCode.toLowerCase()
    )
  ) {
    throw new Error("Mã giảng viên đã tồn tại.");
  }

  teachers[index] = { ...teachers[index], ...payload, id };
  saveTeachers(teachers);

  return teachers[index];
}

export async function toggleTeacherLock(id) {
  const teachers = readTeachers();
  const teacher = teachers.find((item) => item.id === id);

  if (!teacher) {
    throw new Error("Không tìm thấy giảng viên.");
  }

  teacher.status =
    teacher.status === "ACTIVE" ? "LOCKED" : "ACTIVE";

  saveTeachers(teachers);
  return teacher;
}
