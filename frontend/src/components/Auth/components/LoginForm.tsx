import AlertSuccess from "../../common/AlertSucess";
import AlertError from "../../common/AlertError";
import { useState } from "react";
import { useUser } from "../../../context/authContext";
const LoginForm = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const { login } = useUser();

  const Login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const data = await login(email, password);
    if (data.user) {
      try {
        setSuccess(true);
        setMessage("Đăng Nhập Thành Công");
        form.reset();
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
        window.location.href = "/";
      } catch (err) {
        setError(true);
        setMessage("Đăng Nhập Thất Bại");
        setTimeout(() => {
          setError(false);
        }, 3000);
      }
    } else {
      setError(true);
      setMessage(
        "Tài khoản đã bị vô hiệu hoá. Vui lòng kiểm tra email để kích hoạt lại.",
      );
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-6 relative overflow-hidden">
        {/* Các khối màu trang trí phía sau (Giống hệt RegisterForm) */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-200/40 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200/40 rounded-full blur-[100px]"></div>

        {/* Card Container */}
        <div className="w-full max-w-md relative">
          {/* Lớp viền Glow nhẹ */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2.5rem] blur opacity-15"></div>

          <div className="relative bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] border border-white p-10">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                Task
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                  Flow
                </span>
              </h1>
              <div className="h-1.5 w-10 bg-indigo-600 mx-auto mt-2 rounded-full"></div>
              <p className="mt-4 text-slate-500 text-sm font-medium">
                Chào mừng bạn trở lại!
              </p>
            </div>

            <form className="space-y-6" onSubmit={Login}>
              {/* Email Input */}
              <div className="group">
                <label className="block text-slate-700 text-xs uppercase tracking-widest font-bold mb-2 ml-1">
                  Email của bạn
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="name@taskflow.com"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                />
              </div>

              {/* Password Input */}
              <div className="group">
                <div className="flex justify-between mb-2 ml-1">
                  <label className="text-slate-700 text-xs uppercase tracking-widest font-bold">
                    Mật khẩu
                  </label>
                  <a
                    href="#"
                    className="text-xs text-indigo-600 font-bold hover:text-indigo-800 transition"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
                />
                {/* Tiêu đề/Lời nhắn nhỏ dưới Quên mật khẩu */}
                <p className="mt-2 ml-1 text-[11px] text-slate-400 italic">
                  * Đảm bảo mật khẩu của bạn có ít nhất 8 ký tự để bảo mật tối
                  ưu.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 rounded-2xl shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)] transform hover:-translate-y-1 transition-all duration-300 active:scale-95 mt-2"
              >
                Đăng nhập ngay
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Bạn mới biết đến TaskFlow?{" "}
                <a
                  href="/register"
                  className="text-indigo-600 font-bold hover:text-indigo-800 transition underline-offset-4 hover:underline"
                >
                  Đăng ký tài khoản
                </a>
              </p>

              <p className="text-slate-500 text-sm mt-3">
                Bạn đã quên mật khẩu?{" "}
                <a
                  href="/forgot"
                  className="text-indigo-600 font-bold hover:text-indigo-800 transition underline-offset-4 hover:underline"
                >
                  Quên mật khẩu
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {success && <AlertSuccess message={message} />}
      {error && <AlertError message={message} />}
    </>
  );
};

export default LoginForm;
