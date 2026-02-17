import handleResetPassword from "../../../api/auth/handleResetPassword";
import AlertSuccess from "../../common/AlertSucess";
import AlertError from "../../common/AlertError";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
const ResetPasswordForm = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const ResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPassword && !confirmNewPassword && !token) return;
    const result = await handleResetPassword(
      newPassword,
      confirmNewPassword,
      token,
    );
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      window.location.href = "/login"
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
      window.location.href = "/forgot"
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-6 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-100/40 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-100/40 rounded-full blur-[100px]"></div>

        <div className="w-full max-w-md relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-[2.5rem] blur opacity-15"></div>

          <div className="relative bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] border border-white p-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-emerald-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04 Pel m-2.25 14.153a11.963 11.963 0 0017.3 0"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                Thiết lập{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-indigo-600">
                  mới
                </span>
              </h1>
              <p className="mt-4 text-slate-500 text-sm">
                Nhập mật khẩu mới của bạn bên dưới để hoàn tất việc khôi phục.
              </p>
            </div>

            <form className="space-y-6" onSubmit={ResetPassword}>
              {/* New Password */}
              <div className="group">
                <label className="block text-slate-700 text-[10px] uppercase tracking-[0.2em] font-black mb-2 ml-1">
                  Mật khẩu mới
                </label>
                <input
                  onChange={(e) => setNewPassword(e.target.value)}
                  name="newPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300"
                />
              </div>

              {/* Confirm New Password */}
              <div className="group">
                <label className="block text-slate-700 text-[10px] uppercase tracking-[0.2em] font-black mb-2 ml-1">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  name="confirmNewPassword"
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-300"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 rounded-2xl shadow-[0_15px_30px_-5px_rgba(16,185,129,0.3)] transform hover:-translate-y-1 transition-all duration-300 active:scale-95 mt-2"
              >
                Lưu mật khẩu mới
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-slate-400 text-xs">
                Mật khẩu mới phải khác với các mật khẩu đã sử dụng trước đó.
              </p>
            </div>
          </div>
        </div>
      </div>

      {success && <AlertSuccess message="Reset Password is Success" />}
      {error && <AlertError message="Reset Password is not success" />}
    </>
  );
};

export default ResetPasswordForm;
