
const ChangePasswordForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-6 relative overflow-hidden">
      {/* Khối màu trang trí nền (Đồng bộ với các trang trước) */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-indigo-200/40 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-200/40 rounded-full blur-[100px]"></div>

      {/* Card Container */}
      <div className="w-full max-w-md relative">
        {/* Lớp viền Glow nhẹ */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[2.5rem] blur opacity-15"></div>
        
        <div className="relative bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] border border-white p-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8-0v4h8z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Đổi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">mật khẩu</span>
            </h1>
            <p className="mt-4 text-slate-500 text-sm">
              Đảm bảo tài khoản của bạn luôn được bảo vệ an toàn.
            </p>
          </div>

          <form className="space-y-6">
            {/* Mật khẩu cũ */}
            <div className="group">
              <label className="block text-slate-700 text-[10px] uppercase tracking-[0.2em] font-black mb-2 ml-1">
                Mật khẩu hiện tại
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300"
              />
            </div>

            {/* Mật khẩu mới */}
            <div className="group">
              <label className="block text-slate-700 text-[10px] uppercase tracking-[0.2em] font-black mb-2 ml-1">
                Mật khẩu mới
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
              />
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div className="group">
              <label className="block text-slate-700 text-[10px] uppercase tracking-[0.2em] font-black mb-2 ml-1">
                Nhập lại mật khẩu mới
              </label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-300"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-4 rounded-2xl shadow-[0_15px_30px_-5px_rgba(30,41,59,0.25)] hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all duration-300 active:scale-95 mt-2"
            >
              Cập nhật mật khẩu
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <button 
              type="button"
              className="text-sm font-bold text-slate-400 hover:text-slate-600 transition"
              onClick={() => window.history.back()}
            >
              Hủy bỏ và quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordForm;