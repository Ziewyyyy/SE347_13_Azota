
const STORAGE_KEY = "azota_admin_subjects";

const initialSubjects = [
  {
    id: "SUB001",
    subjectCode: "SE101",
    subjectName: "Nhập môn công nghệ phần mềm",
    credits: 4,
    faculty: "Công nghệ phần mềm",
    status: "ACTIVE",
  },
  {
    id: "SUB002",
    subjectCode: "IT002",
    subjectName: "Cấu trúc dữ liệu và giải thuật",
    credits: 3,
    faculty: "Khoa học máy tính",
    status: "INACTIVE",
  },
];

function readSubjects() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialSubjects)
      );
      return [...initialSubjects];
    }

    const data = JSON.parse(stored);
    return Array.isArray(data) ? data : [...initialSubjects];
  } catch {
    return [...initialSubjects];
  }
}

function saveSubjects(subjects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subjects));
}

export async function getSubjects() {
  return readSubjects();
}

export async function createSubject(payload) {
  const subjects = readSubjects();

  if (
    subjects.some(
      (item) =>
        item.subjectCode.toLowerCase() ===
        payload.subjectCode.toLowerCase()
    )
  ) {
    throw new Error("Mã môn học đã tồn tại.");
  }

  const subject = {
    ...payload,
    id: crypto.randomUUID(),
  };

  saveSubjects([...subjects, subject]);
  return subject;
}

export async function updateSubject(id, payload) {
  const subjects = readSubjects();
  const index = subjects.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error("Không tìm thấy môn học.");
  }

  if (
    subjects.some(
      (item) =>
        item.id !== id &&
        item.subjectCode.toLowerCase() ===
          payload.subjectCode.toLowerCase()
    )
  ) {
    throw new Error("Mã môn học đã tồn tại.");
  }

  subjects[index] = {
    ...subjects[index],
    ...payload,
    id,
  };

  saveSubjects(subjects);
  return subjects[index];
}

export async function toggleSubjectStatus(id) {
  const subjects = readSubjects();
  const subject = subjects.find((item) => item.id === id);

  if (!subject) {
    throw new Error("Không tìm thấy môn học.");
  }

  subject.status =
    subject.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  saveSubjects(subjects);
  return subject;
}
