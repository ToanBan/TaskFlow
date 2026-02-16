import handleFogotPassword from "../../../api/auth/handleFogotPassword";
import AlertSuccess from "../../common/AlertSucess";
import AlertError from "../../common/AlertError";
import { useState } from "react";
const ForgotPasswordForm = () => {
  const [success, setSucess] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");

  const ForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    const result = await handleFogotPassword(email);
    if (result) {
      setSucess(true);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-6 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-200/40 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200/40 rounded-full blur-[100px]"></div>
        <div className="w-full max-w-md relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2.5rem] blur opacity-15"></div>

          <div className="relative bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] border border-white p-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>

              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                Quên{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                  mật khẩu?
                </span>
              </h1>
              <p className="mt-4 text-slate-500 text-sm leading-relaxed">
                Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn
                khôi phục mật khẩu ngay lập tức.
              </p>
            </div>

            <form className="space-y-6" onSubmit={ForgotPassword}>
              <div className="group">
                <label className="block text-slate-700 text-[10px] uppercase tracking-[0.2em] font-black mb-2 ml-1">
                  Email khôi phục
                </label>
                <div className="relative">
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    type="email"
                    placeholder="name@taskflow.com"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300 group-hover:border-slate-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold py-4 rounded-2xl shadow-[0_15px_30px_-5px_rgba(79,70,229,0.4)] transform hover:-translate-y-1 transition-all duration-300 active:scale-95"
              >
                Gửi mã xác nhận
              </button>
            </form>

            {/* Footer - Link quay lại đăng nhập */}
            <div className="mt-10 text-center">
              <a
                href="/login"
                className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Quay lại Đăng nhập
              </a>
            </div>
          </div>
        </div>
      </div>

      {success && (
        <AlertSuccess message="Vui Lòng Kiểm Tra Email Để Đến Bước Tiếp Theo" />
      )}
      {error && <AlertError message="Xác thực không thành công" />}
    </>
  );
};

export default ForgotPasswordForm;
