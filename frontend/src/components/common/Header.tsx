import React, { useState } from "react";
import {
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useUser } from "../../context/authContext";
import handleLogout from "../../api/auth/handleLogout";
import AlertError from "./AlertError";
const Header: React.FC = () => {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState(false);
  const Logout = async () => {
    const result = await handleLogout();
    if (result) {
      window.location.href = "/login";
    } else {
      setError(true);

      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="flex-1 max-w-xl">
          <div className="relative group">
            <input
              type="text"
              placeholder="Tìm kiếm nội dung..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 px-6 pl-12 focus:outline-none focus:ring-1 focus:ring-red-600/60 focus:bg-white/10 transition-all text-sm placeholder:text-gray-600"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500 transition-colors"
              size={18}
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-600 rounded-full ring-2 ring-[#050505]"></span>
          </button>

          <div className="h-8 w-px bg-white/10 mx-2"></div>

          <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <div className="flex items-center gap-3 cursor-pointer group p-1 pr-3 rounded-2xl hover:bg-white/5 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-400 p-[1.5px] shadow-lg shadow-red-900/20">
                <div className="w-full h-full bg-[#050505] rounded-[14px] flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
              </div>
              <div className="hidden md:block">
                <p className="text-[11px] font-black text-white leading-none mb-1 uppercase tracking-tighter">
                  {user?.username}
                </p>
                <p className="text-[9px] text-red-500 font-bold tracking-widest">
                  PRO
                </p>
              </div>
              <ChevronDown
                size={14}
                className={`text-gray-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180 text-white" : ""}`}
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-[#0f0f0f] border border-white/10 rounded-[24px] shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200">
                <div className="px-4 py-3 border-b border-white/5 mb-2">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                    Tài khoản
                  </p>
                  <p className="text-xs text-white font-bold truncate mt-1">
                    {user?.email}
                  </p>
                </div>

                <a href="/profile">
                  <DropdownItem
                    icon={<User size={16} />}
                    label="Hồ sơ của tôi"
                  />
                </a>
                <DropdownItem
                  icon={<ShieldCheck size={16} />}
                  label="VStream Studio"
                />
                <DropdownItem
                  icon={<Settings size={16} />}
                  label="Cài đặt tài khoản"
                />

                <div className="h-px bg-white/5 my-2 mx-4"></div>

                <button
                  onClick={Logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200"
                >
                  <LogOut size={16} />
                  <span className="text-xs font-black uppercase tracking-widest">
                    Đăng xuất
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {error && <AlertError message="Đăng Xuất Không Thành Công" />}
    </>
  );
};

const DropdownItem: React.FC<{ icon: React.ReactNode; label: string }> = ({
  icon,
  label,
}) => (
  <div className="flex items-center gap-3 px-4 py-3 cursor-pointer text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group">
    <div className="text-gray-500 group-hover:text-red-500 transition-colors">
      {icon}
    </div>
    <span className="text-xs font-black uppercase tracking-widest">
      {label}
    </span>
  </div>
);

export default Header;
