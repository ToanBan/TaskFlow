import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import handleActiveAccount from "../api/auth/handleActiveAccount";
import AlertSuccess from "../components/common/AlertSucess";
import AlertError from "../components/common/AlertError";
const ActiveAccount: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);


  const ActiveAccount = async () => {
    const result = await handleActiveAccount(token);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 4000);
      window.location.href = "/login"
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 3000);
      window.location.href = "/login"
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-6 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-200/40 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200/40 rounded-full blur-[100px]"></div>

        {/* Card Container */}
        <div className="w-full max-w-md relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2.5rem] blur opacity-15"></div>

          <div className="relative bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] border border-white p-10 text-center">
            {/* Icon minh họa */}
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-4">
              Chào mừng{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                trở lại!
              </span>
            </h1>

            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Chúng tôi rất vui khi thấy bạn quay lại với **TaskFlow**. Mọi dữ
              liệu cũ của bạn đã sẵn sàng để được khôi phục.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 mb-8 border border-slate-100">
              <p className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mb-1">
                Mã xác thực của bạn
              </p>
              <p className="text-xs font-mono text-indigo-600 truncate">
                {token}
              </p>{" "}
              {/* Hiển thị token giả */}
            </div>

            <button
              onClick={ActiveAccount}
              type="button"
              className="w-full font-bold py-4 rounded-2xl shadow-lg transform transition-all duration-300 active:scale-95 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white hover:-translate-y-1 shadow-indigo-200"
            >
              Xác nhận kích hoạt lại
            </button>

            <div className="mt-8">
              <a
                href="/login"
                className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition"
              >
                Hủy bỏ và thoát
              </a>
            </div>
          </div>
        </div>
      </div>

      {success && (<AlertSuccess message="Kích Hoạt Tài Khoản Thành Công"/>)}
      {error && (<AlertError message="Kích Hoạt Tài Khoản Thất Bại"/>)}
    </>
  );
};

export default ActiveAccount;
