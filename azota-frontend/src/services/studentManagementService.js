
const STORAGE_KEY = "azota_admin_students";

const initialStudents = [
  {
    id: "S001",
    studentCode: "22520001",
    fullName: "Nguyễn Văn An",
    email: "an@student.uit.edu.vn",
    className: "SE01",
    faculty: "Công nghệ phần mềm",
    status: "ACTIVE",
  },
  {
    id: "S002",
    studentCode: "22520002",
    fullName: "Phạm Hoàng Nam",
    email: "nam@student.uit.edu.vn",
    className: "SE02",
    faculty: "Công nghệ phần mềm",
    status: "LOCKED",
  },
];

function readStudents() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialStudents)
      );
      return [...initialStudents];
    }

    const students = JSON.parse(stored);
    return Array.isArray(students)
      ? students
      : [...initialStudents];
  } catch {
    return [...initialStudents];
  }
}

function writeStudents(students) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

export async function getStudents() {
  return readStudents();
}

export async function createStudent(payload) {
  const students = readStudents();

  if (
    students.some(
      (student) =>
        student.studentCode === payload.studentCode
    )
  ) {
    throw new Error("Mã sinh viên đã tồn tại.");
  }

  const newStudent = {
    ...payload,
    id: crypto.randomUUID(),
    status: payload.status || "ACTIVE",
  };

  students.push(newStudent);
  writeStudents(students);

  return newStudent;
}

export async function updateStudent(id, payload) {
  const students = readStudents();

  const index = students.findIndex(
    (student) => student.id === id
  );

  if (index === -1) {
    throw new Error("Không tìm thấy sinh viên.");
  }

  if (
    students.some(
      (student) =>
        student.studentCode === payload.studentCode &&
        student.id !== id
    )
  ) {
    throw new Error("Mã sinh viên đã tồn tại.");
  }

  students[index] = {
    ...students[index],
    ...payload,
    id,
  };

  writeStudents(students);
  return students[index];
}

export async function toggleStudentLock(id) {
  const students = readStudents();

  const student = students.find((item) => item.id === id);

  if (!student) {
    throw new Error("Không tìm thấy sinh viên.");
  }

  student.status =
    student.status === "ACTIVE" ? "LOCKED" : "ACTIVE";

  writeStudents(students);
  return student;
}
