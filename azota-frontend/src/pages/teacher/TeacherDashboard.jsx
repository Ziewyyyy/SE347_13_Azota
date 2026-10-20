
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  School,
  Users,
  ClipboardCheck,
  CalendarClock,
  ArrowRight,
  Clock3,
  BookOpen,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getTeacherDashboard } from "../../services/teacherService";
import "../../styles/TeacherDashboard.css";

const formatDate = (date) =>
  new Date(date).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getTeacherDashboard(user?.teacherId || user?.userId)
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
  }, [user?.teacherId, user?.userId]);

  if (loading) return <p>Đang tải dashboard...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!data) return null;

  const stats = [
    {
      title: "Lớp đang dạy",
      value: data.stats.totalClasses,
      icon: School,
      color: "blue",
    },
    {
      title: "Tổng sinh viên",
      value: data.stats.totalStudents,
      icon: Users,
      color: "green",
    },
    {
      title: "Bài chưa chấm",
      value: data.stats.pendingSubmissions,
      icon: ClipboardCheck,
      color: "orange",
    },
    {
      title: "Bài thi sắp tới",
      value: data.stats.upcomingExams,
      icon: CalendarClock,
      color: "purple",
    },
  ];

  return (
    <div className="teacher-dashboard">
      <div className="teacher-welcome">
        <h1>Xin chào, {user?.fullName || "Giảng viên"} 👋</h1>
        <p>
          Chào mừng bạn quay trở lại Azota.
          Đây là tổng quan hoạt động giảng dạy của bạn.
        </p>
      </div>

      <div className="teacher-stats">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="teacher-stat-card" key={stat.title}>
              <div>
                <p>{stat.title}</p>
                <h2>{stat.value}</h2>
              </div>
              <div className={`teacher-stat-icon ${stat.color}`}>
                <Icon size={26} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="teacher-dashboard-grid">
        <section className="teacher-panel">
          <div className="teacher-panel-header">
            <h2><ClipboardCheck size={21} /> Bài tập cần chấm</h2>
            <button onClick={() => navigate("/teacher/grading")}>
              Xem tất cả <ArrowRight size={16} />
            </button>
          </div>

          {data.pendingAssignments.length === 0 ? (
            <p>Không có bài tập cần chấm.</p>
          ) : (
            data.pendingAssignments.map((item) => (
              <div className="teacher-list-item" key={item.assignmentId}>
                <div>
                  <h3>{item.title}</h3>
                  <p>
                    {data.classes.find(
                      (c) => c.classId === item.classId
                    )?.className}
                  </p>
                  <small>
                    <Clock3 size={14} />
                    Hạn nộp: {formatDate(item.deadline)}
                  </small>
                </div>
                <span className="teacher-status pending">
                  {item.pendingCount} bài
                </span>
              </div>
            ))
          )}
        </section>

        <section className="teacher-panel">
          <div className="teacher-panel-header">
            <h2><CalendarClock size={21} /> Bài thi sắp tới</h2>
            <button onClick={() => navigate("/teacher/exams")}>
              Xem tất cả <ArrowRight size={16} />
            </button>
          </div>

          {data.upcomingExams.length === 0 ? (
            <p>Không có bài thi sắp tới.</p>
          ) : (
            data.upcomingExams.map((exam) => (
              <div className="teacher-list-item" key={exam.examId}>
                <div>
                  <h3>{exam.title}</h3>
                  <p>
                    {data.classes.find(
                      (c) => c.classId === exam.classId
                    )?.className}
                  </p>
                  <small>
                    <Clock3 size={14} />
                    {formatDate(exam.startTime)}
                  </small>
                </div>
                <span className="teacher-status upcoming">
                  {exam.durationMinutes} phút
                </span>
              </div>
            ))
          )}
        </section>

        <section className="teacher-panel">
          <div className="teacher-panel-header">
            <h2><School size={21} /> Lớp học của tôi</h2>
            <button onClick={() => navigate("/teacher/classes")}>
              Xem tất cả <ArrowRight size={16} />
            </button>
          </div>

          {data.classes.map((item) => (
            <div className="teacher-list-item" key={item.classId}>
              <div>
                <h3>{item.className}</h3>
                <p>{item.studentCount} sinh viên</p>
              </div>
              <span className="teacher-class-code">
                {item.classCode}
              </span>
            </div>
          ))}
        </section>

        <section className="teacher-panel">
          <div className="teacher-panel-header">
            <h2><BookOpen size={21} /> Quản lý giảng dạy</h2>
          </div>

          {[
            { label: "Tạo bài tập", path: "/teacher/assignments" },
            { label: "Quản lý câu hỏi", path: "/teacher/questions" },
            { label: "Quản lý bài thi", path: "/teacher/exams" },
            { label: "Xem thống kê", path: "/teacher/statistics" },
          ].map((action) => (
            <button
              key={action.path}
              className="teacher-quick-action"
              onClick={() => navigate(action.path)}
            >
              <span>{action.label}</span>
              <ArrowRight size={17} />
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}
