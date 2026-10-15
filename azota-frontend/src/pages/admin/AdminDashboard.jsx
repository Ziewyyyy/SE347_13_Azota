import {
  GraduationCap,
  Presentation,
  School,
  BookOpen,
  BookOpenCheck,
} from "lucide-react";

import StatCard from "../../components/StatCard";

export default function AdminDashboard() {
  // Mock Data - sẽ thay bằng API Backend sau
  const statistics = [
    {
      title: "Sinh viên",
      value: 1250,
      icon: GraduationCap,
    },
    {
      title: "Giảng viên",
      value: 85,
      icon: Presentation,
    },
    {
      title: "Lớp học",
      value: 64,
      icon: School,
    },
    {
      title: "Môn học",
      value: 32,
      icon: BookOpen,
    },
    {
      title: "Tổng số bài thi",
      value: 148,
      icon: BookOpenCheck,
      wide: true,
    },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="stats-grid">
        {statistics.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value.toLocaleString("vi-VN")}
            icon={stat.icon}
            wide={stat.wide}
          />
        ))}
      </div>
    </div>
  );
}