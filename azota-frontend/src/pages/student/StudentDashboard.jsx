
import { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  CalendarClock,
  Award,
  Clock3,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentDashboard } from "../../services/studentService";
import "../../styles/StudentDashboard.css";

const formatDate = (value) =>
  new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getStudentDashboard(user?.studentId || user?.userId)
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) setError("Không thể tải dữ liệu.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.studentId, user?.userId]);

  if (loading) {
    return <p>Đang tải dashboard...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!data) return null;

  const stats = [
    {
      title: "Lớp học của tôi",
      value: data.stats.totalClasses,
      icon: BookOpen,
      color: "blue",
    },
    {
      title: "Bài tập cần nộp",
      value: data.stats.pendingAssignments,
      icon: ClipboardList,
      color: "orange",
    },
    {
      title: "Bài thi sắp tới",
      value: data.stats.upcomingExams,
      icon: CalendarClock,
      color: "purple",
    },
    {
      title: "Điểm gần đây",
      value: data.stats.latestScore ?? "--",
      icon: Award,
      color: "green",
    },
  ];

  return (
    <div className="student-dashboard">
      <div className="student-welcome">
        <h1>Xin chào, {user?.fullName || "Sinh viên"} 👋</h1>
        <p>
          Chào mừng bạn quay trở lại Azota.
          Hãy theo dõi tiến độ học tập hôm nay!
        </p>
      </div>

      <div className="student-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="student-stat-card" key={stat.title}>
              <div>
                <p>{stat.title}</p>
                <h2>{stat.value}</h2>
              </div>

              <div className={`student-stat-icon ${stat.color}`}>
                <Icon size={26} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="student-dashboard-grid">
        <section className="student-panel">
          <div className="student-panel-header">
            <h2><ClipboardList size={21} /> Bài tập sắp đến hạn</h2>
            <button onClick={() => navigate("/student/assignments")}>
              Xem tất cả <ArrowRight size={16} />
            </button>
          </div>

          {data.upcomingAssignments.length === 0 ? (
            <p>Không có bài tập sắp đến hạn.</p>
          ) : (
            data.upcomingAssignments.map((item) => (
              <div className="student-list-item" key={item.assignmentId}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.className}</p>
                  <small>
                    <Clock3 size={14} />
                    Hạn nộp: {formatDate(item.deadline)}
                  </small>
                </div>
                <span className="student-status pending">Chưa nộp</span>
              </div>
            ))
          )}
        </section>

        <section className="student-panel">
          <div className="student-panel-header">
            <h2><CalendarClock size={21} /> Bài thi sắp tới</h2>
            <button onClick={() => navigate("/student/exams")}>
              Xem tất cả <ArrowRight size={16} />
            </button>
          </div>

          {data.upcomingExams.length === 0 ? (
            <p>Không có bài thi sắp tới.</p>
          ) : (
            data.upcomingExams.map((exam) => (
              <div className="student-list-item" key={exam.examId}>
                <div>
                  <h3>{exam.title}</h3>
                  <p>{exam.className}</p>
                  <small>
                    <Clock3 size={14} />
                    {formatDate(exam.startTime)}
                  </small>
                </div>
                <span className="student-status upcoming">
                  {exam.durationMinutes} phút
                </span>
              </div>
            ))
          )}
        </section>

        <section className="student-panel">
          <div className="student-panel-header">
            <h2><GraduationCap size={21} /> Lớp học của tôi</h2>
            <button onClick={() => navigate("/student/classes")}>
              Xem tất cả <ArrowRight size={16} />
            </button>
          </div>

          {data.classes.map((item) => (
            <div className="student-list-item" key={item.classId}>
              <div>
                <h3>{item.className}</h3>
                <p>Giảng viên: {item.teacherName}</p>
              </div>
              <span className="student-class-code">{item.classCode}</span>
            </div>
          ))}
        </section>

        <section className="student-panel">
          <div className="student-panel-header">
            <h2><Award size={21} /> Kết quả gần đây</h2>
            <button onClick={() => navigate("/student/results")}>
              Xem tất cả <ArrowRight size={16} />
            </button>
          </div>

          {data.results.map((result) => (
            <div className="student-list-item" key={result.id}>
              <div>
                <h3>{result.title}</h3>
                <p>Đã chấm điểm</p>
              </div>
              <span className="student-score">
                {result.score}/{result.maxScore}
              </span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
