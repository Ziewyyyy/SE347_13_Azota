import { useState } from "react";
import { BookOpen, Eye, EyeOff } from "lucide-react";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      setLoading(true);

      await login(identifier.trim(), password);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="brand">▣ Azota</div>

          <div className="intro">
            <BookOpen size={36} />

            <h2>Học tập và thi trực tuyến</h2>

            <p>
              Nền tảng quản lý bài tập và thi trực tuyến
              dành cho nhà trường.
            </p>
          </div>

          <div className="copyright">
            © 2026 Azota Learning
          </div>
        </div>

        <div className="login-right">
          <form className="login-form" onSubmit={handleLogin}>
            <h1>Đăng nhập</h1>

            <p className="subtitle">
              Đăng nhập để tiếp tục học tập
            </p>

            <div className="form-group">
              <label>Email hoặc mã số người dùng</label>

              <input
                type="text"
                placeholder="Nhập email hoặc mã số"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="forgot-password">
              <a href="#">Quên mật khẩu?</a>
            </div>

            {error && (
              <p className="error-message">{error}</p>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}