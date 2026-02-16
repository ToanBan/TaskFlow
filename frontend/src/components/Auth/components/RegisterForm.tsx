import type React from "react";
import handleRegister from "../../../api/auth/handleRegister";
import AlertSuccess from "../../common/AlertSucess";
import { useState } from "react";
import AlertError from "../../common/AlertError";
const RegisterForm = () => {
  const [success, setSucess] = useState(false);
  const [error, setError] = useState(false);
  const Register = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const result = await handleRegister(
      username,
      email,
      password,
      confirmPassword,
    );
    if (result) {
      setSucess(true);
      form.reset();
      setTimeout(() => {
        setSucess(false);
      }, 3000);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-6 relative">
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-200/40 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200/40 rounded-full blur-[100px]"></div>

        <div className="w-full max-w-lg relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2.5rem] blur opacity-20"></div>

          <div className="relative bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-white p-10 md:p-12">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                Task
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                  Flow
                </span>
              </h1>
              <div className="h-1.5 w-12 bg-indigo-600 mx-auto mt-2 rounded-full"></div>
              <p className="mt-4 text-slate-500 text-sm font-medium">
                Đăng ký để quản lý công việc hiệu quả hơn
              </p>
            </div>

            <form className="space-y-5" onSubmit={Register}>
              {/* Tên người dùng */}
              <div className="group">
                <label className="block text-slate-700 text-xs uppercase tracking-widest font-bold mb-2 ml-1">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 group-hover:border-slate-200"
                  placeholder="Ví dụ: vanchuong_task"
                  name="username"
                />
              </div>

              {/* Email */}
              <div className="group">
                <label className="block text-slate-700 text-xs uppercase tracking-widest font-bold mb-2 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 group-hover:border-slate-200"
                  placeholder="name@taskflow.com"
                  name="email"
                />
              </div>

              {/* Password Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-slate-700 text-xs uppercase tracking-widest font-bold mb-2 ml-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 group-hover:border-slate-200"
                    placeholder="••••••••"
                    name="password"
                  />
                </div>
                <div className="group">
                  <label className="block text-slate-700 text-xs uppercase tracking-widest font-bold mb-2 ml-1">
                    Xác nhận
                  </label>
                  <input
                    type="password"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 group-hover:border-slate-200"
                    placeholder="••••••••"
                    name="confirmPassword"
                  />
                </div>
              </div>

              {/* Submit Button - Nổi bật hoàn toàn */}
              <button
                type="submit"
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 rounded-2xl shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)] transform hover:-translate-y-1 transition-all duration-300 active:scale-95"
              >
                Tạo tài khoản TaskFlow
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-sm">
                Bạn đã có tài khoản rồi?{" "}
                <a
                  href="/login"
                  className="text-indigo-600 font-bold hover:text-indigo-800 transition"
                >
                  Đăng nhập ngay
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {success && <AlertSuccess message="Đăng Ký Thành Công" />}
      {error && <AlertError message="Đăng Ký Không Thành Công" />}
    </>
  );
};

export default RegisterForm;
