
const mockClasses = [
  {
    classId: "C001",
    classCode: "SE347",
    className: "Công nghệ Web và ứng dụng",
    semester: "HK1",
    academicYear: 2026,
    studentCount: 45,
  },
  {
    classId: "C002",
    classCode: "SE363",
    className: "Dữ liệu lớn",
    semester: "HK1",
    academicYear: 2026,
    studentCount: 38,
  },
  {
    classId: "C003",
    classCode: "SE310",
    className: "Cơ sở dữ liệu",
    semester: "HK1",
    academicYear: 2026,
    studentCount: 42,
  },
  {
    classId: "C004",
    classCode: "SE104",
    className: "Nhập môn Công nghệ phần mềm",
    semester: "HK1",
    academicYear: 2026,
    studentCount: 31,
  },
];

const mockAssignments = [
  {
    assignmentId: "A001",
    classId: "C001",
    title: "Xây dựng giao diện ReactJS",
    deadline: "2026-10-25T23:59:00",
    pendingCount: 8,
  },
  {
    assignmentId: "A002",
    classId: "C003",
    title: "Thiết kế cơ sở dữ liệu",
    deadline: "2026-10-28T23:59:00",
    pendingCount: 4,
  },
];

const mockExams = [
  {
    examId: "E001",
    classId: "C001",
    title: "Kiểm tra giữa kỳ ReactJS",
    startTime: "2026-10-27T08:00:00",
    durationMinutes: 60,
  },
  {
    examId: "E002",
    classId: "C002",
    title: "Kiểm tra Spark",
    startTime: "2026-10-29T09:00:00",
    durationMinutes: 45,
  },
  {
    examId: "E003",
    classId: "C003",
    title: "Kiểm tra SQL",
    startTime: "2026-11-02T08:00:00",
    durationMinutes: 60,
  },
];

export async function getTeacherDashboard(teacherId) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // TODO: Khi có backend, dùng teacherId để lấy dữ liệu thật.
  void teacherId;

  const now = new Date();

  const upcomingExams = mockExams
    .filter((exam) => new Date(exam.startTime) >= now)
    .sort(
      (a, b) =>
        new Date(a.startTime) - new Date(b.startTime)
    );

  const pendingAssignments = mockAssignments.filter(
    (assignment) => assignment.pendingCount > 0
  );

  return {
    classes: mockClasses,
    pendingAssignments,
    upcomingExams,
    stats: {
      totalClasses: mockClasses.length,
      totalStudents: mockClasses.reduce(
        (sum, item) => sum + item.studentCount,
        0
      ),
      pendingSubmissions: pendingAssignments.reduce(
        (sum, item) => sum + item.pendingCount,
        0
      ),
      upcomingExams: upcomingExams.length,
    },
  };
}
