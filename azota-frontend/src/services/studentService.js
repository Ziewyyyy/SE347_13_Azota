
const mockData = {
  classes: [
    {
      classId: "C001",
      classCode: "SE347",
      className: "Công nghệ Web và ứng dụng",
      teacherName: "Nguyễn Văn Bình",
    },
    {
      classId: "C002",
      classCode: "SE363",
      className: "Dữ liệu lớn",
      teacherName: "Trần Thị Hoa",
    },
    {
      classId: "C003",
      classCode: "SE310",
      className: "Cơ sở dữ liệu",
      teacherName: "Lê Văn Minh",
    },
  ],

  assignments: [
    {
      assignmentId: "A001",
      title: "Xây dựng giao diện ReactJS",
      className: "Công nghệ Web và ứng dụng",
      deadline: "2026-10-25T23:59:00",
      status: "NOT_SUBMITTED",
    },
    {
      assignmentId: "A002",
      title: "Phân tích dữ liệu bằng Spark",
      className: "Dữ liệu lớn",
      deadline: "2026-10-28T23:59:00",
      status: "NOT_SUBMITTED",
    },
    {
      assignmentId: "A003",
      title: "Thiết kế cơ sở dữ liệu",
      className: "Cơ sở dữ liệu",
      deadline: "2026-10-22T23:59:00",
      status: "SUBMITTED",
    },
  ],

  exams: [
    {
      examId: "E001",
      title: "Kiểm tra giữa kỳ",
      className: "Công nghệ Web và ứng dụng",
      startTime: "2026-10-27T08:00:00",
      durationMinutes: 60,
    },
    {
      examId: "E002",
      title: "Kiểm tra chương 1",
      className: "Cơ sở dữ liệu",
      startTime: "2026-10-30T09:00:00",
      durationMinutes: 45,
    },
  ],

  results: [
    {
      id: "R001",
      title: "Bài tập HTML/CSS",
      score: 9,
      maxScore: 10,
    },
    {
      id: "R002",
      title: "Kiểm tra SQL",
      score: 8,
      maxScore: 10,
    },
  ],

  notifications: [
    {
      id: "N001",
      title: "Bài tập mới",
      message: "Giảng viên đã giao bài tập ReactJS.",
      isRead: false,
    },
    {
      id: "N002",
      title: "Lịch kiểm tra",
      message: "Kiểm tra giữa kỳ vào ngày 27/10.",
      isRead: false,
    },
  ],
};

export async function getStudentDashboard(studentId) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // studentId sẽ dùng để lọc dữ liệu khi kết nối API thật.
  void studentId;

  const now = new Date();

  const upcomingAssignments = mockData.assignments
    .filter(
      (item) =>
        item.status === "NOT_SUBMITTED" &&
        new Date(item.deadline) >= now
    )
    .sort(
      (a, b) =>
        new Date(a.deadline) - new Date(b.deadline)
    );

  const upcomingExams = mockData.exams
    .filter((item) => new Date(item.startTime) >= now)
    .sort(
      (a, b) =>
        new Date(a.startTime) - new Date(b.startTime)
    );

  return {
    ...mockData,
    upcomingAssignments,
    upcomingExams,
    stats: {
      totalClasses: mockData.classes.length,
      pendingAssignments: upcomingAssignments.length,
      upcomingExams: upcomingExams.length,
      latestScore: mockData.results[0]?.score ?? null,
    },
  };
}
