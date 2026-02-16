import React from 'react';
import { 
  Home, 
  Compass, 
  PlaySquare, 
  Clock, 
  ThumbsUp, 
  Menu, 
  MoreVertical,
  Flame, 
  Gamepad2, 
  Music2, 
  Tv2, 
  History, 
  Library, 
  ChevronRight,
} from 'lucide-react';
import Header from '../components/common/Header';
interface VideoData {
  id: number;
  title: string;
  author: string;
  views: string;
  time: string;
  thumb: string;
  avatar: string;
  duration: string;
}

interface SidebarItemProps {
  icon: React.ReactElement;
  label: string;
  active?: boolean;
}

const HomePage: React.FC = () => {
 
 
  const categories: string[] = [
    'Tất cả', 'Âm nhạc', 'Trò chơi', 'Trực tiếp', 'Học tập', 
    'Tin tức', 'Công nghệ', 'Hoạt hình', 'Điện ảnh', 'Nấu ăn', 'Du lịch'
  ];

  const videos: VideoData[] = [
    { id: 1, title: 'Hệ thống Streaming với NestJS và Docker chuyên sâu', author: 'VStream Engineering', views: '150K lượt xem', time: '2 giờ trước', thumb: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80', avatar: 'https://i.pravatar.cc/150?u=1', duration: '14:20' },
    { id: 2, title: 'Top 10 kỹ thuật cắt video bằng FFmpeg bạn nên biết', author: 'Dev Mastery', views: '12K lượt xem', time: '5 giờ trước', thumb: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80', avatar: 'https://i.pravatar.cc/150?u=2', duration: '08:45' },
    { id: 3, title: 'Lofi Hip Hop Radio - Beats to relax/study to', author: 'Lofi Girl', views: '2.5M lượt xem', time: 'Đang trực tiếp', thumb: 'https://images.unsplash.com/photo-1516280440614-37939bb92583?w=800&q=80', avatar: 'https://i.pravatar.cc/150?u=3', duration: 'LIVE' },
    { id: 4, title: 'Xây dựng giao diện React đỉnh cao với Tailwind CSS', author: 'UI UX Lab', views: '45K lượt xem', time: '1 ngày trước', thumb: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=800&q=80', avatar: 'https://i.pravatar.cc/150?u=4', duration: '22:10' },
    { id: 5, title: 'Khám phá vũ trụ: Những bí ẩn chưa có lời giải', author: 'Universe Today', views: '1M lượt xem', time: '3 ngày trước', thumb: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80', avatar: 'https://i.pravatar.cc/150?u=5', duration: '18:30' },
    { id: 6, title: 'Setup góc làm việc tối giản cho lập trình viên', author: 'Setup Inspiration', views: '80K lượt xem', time: '1 tuần trước', thumb: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', avatar: 'https://i.pravatar.cc/150?u=6', duration: '10:15' },
    { id: 7, title: 'Hướng dẫn deploy ứng dụng lên Docker Container', author: 'Cloud Native', views: '20K lượt xem', time: '2 tuần trước', thumb: 'https://images.unsplash.com/photo-1605745341112-85968b193ef5?w=800&q=80', avatar: 'https://i.pravatar.cc/150?u=7', duration: '12:00' },
    { id: 8, title: 'Bản tin công nghệ tuần này có gì hot?', author: 'Tech News', views: '100K lượt xem', time: '4 giờ trước', thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', avatar: 'https://i.pravatar.cc/150?u=8', duration: '05:50' },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <aside className="w-64 flex flex-col border-r border-white/5 bg-[#050505] hidden lg:flex shrink-0">
        <div className="h-16 flex items-center px-6 gap-3">
          <Menu size={24} className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center">
              <Tv2 size={18} fill="white" />
            </div>
            <span className="text-xl font-bold tracking-tighter">VSTREAM</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-hide">
          <section>
            <SidebarItem icon={<Home size={20} />} label="Trang chủ" active />
            <SidebarItem icon={<Compass size={20} />} label="Khám phá" />
            <SidebarItem icon={<PlaySquare size={20} />} label="Kênh đăng ký" />
          </section>

          <div className="h-px bg-white/5 mx-3" />

          <section>
            <h3 className="px-4 mb-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Cá nhân</h3>
            <SidebarItem icon={<Library size={20} />} label="Thư viện" />
            <SidebarItem icon={<History size={20} />} label="Video đã xem" />
            <SidebarItem icon={<Clock size={20} />} label="Xem sau" />
            <SidebarItem icon={<ThumbsUp size={20} />} label="Video đã thích" />
          </section>

          <div className="h-px bg-white/5 mx-3" />

          <section>
            <h3 className="px-4 mb-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Khám phá</h3>
            <SidebarItem icon={<Flame size={20} />} label="Thịnh hành" />
            <SidebarItem icon={<Music2 size={20} />} label="Âm nhạc" />
            <SidebarItem icon={<Gamepad2 size={20} />} label="Trò chơi" />
          </section>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative">
       
        <Header/>

        <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
          <div className="px-8 pt-6">
            <div className="relative h-72 rounded-[32px] overflow-hidden group border border-white/5">
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                alt="Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-red-600 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">Đề xuất</span>
                  <span className="text-white/40 text-[9px] uppercase tracking-widest">• 4K HDR</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-none tracking-tight">VStream <br/><span className="text-red-600">Next Gen</span> Player</h1>
                <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
                  Công nghệ truyền tải video thích ứng (HLS) kết hợp cùng hệ thống xử lý phân tán giúp bạn xem video mượt mà ở mọi điều kiện mạng.
                </p>
                <div className="flex gap-4">
                  <button className="bg-white text-black px-8 py-3 rounded-2xl font-black text-xs hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1 flex items-center gap-2 shadow-xl shadow-white/5">
                    XEM NGAY <ChevronRight size={16} />
                  </button>
                  <button className="bg-white/5 backdrop-blur-md px-8 py-3 rounded-2xl font-black text-xs hover:bg-white/10 transition-all border border-white/10 tracking-widest">
                    LƯU VÀO THƯ VIỆN
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-3 px-8 my-10 overflow-x-auto no-scrollbar scroll-smooth">
            {categories.map((cat, i) => (
              <button 
                key={cat}
                className={`px-6 py-2.5 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all uppercase tracking-wider border
                  ${i === 0 
                    ? 'bg-red-600 border-red-500 shadow-lg shadow-red-900/40 text-white' 
                    : 'bg-[#0a0a0a] border-white/5 text-gray-400 hover:border-white/20 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Video Grid */}
          <div className="px-8 pb-16">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 tracking-tight">
              Video mới cập nhật
              <div className="h-1 flex-1 bg-gradient-to-r from-white/10 to-transparent rounded-full ml-4"></div>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
              {videos.map((v) => (
                <div key={v.id} className="group cursor-pointer">
                  {/* Thumbnail Card */}
                  <div className="relative aspect-video rounded-3xl overflow-hidden mb-5 bg-[#111] ring-1 ring-white/5 transition-all duration-500 group-hover:ring-red-600/50 group-hover:shadow-2xl group-hover:shadow-red-900/20">
                    <img 
                      src={v.thumb} 
                      alt={v.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-xl text-[10px] font-black backdrop-blur-xl bg-black/40 border border-white/10">
                      <span className={v.duration === 'LIVE' ? 'text-red-500' : 'text-white'}>
                        {v.duration}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Section */}
                  <div className="flex gap-4 px-1">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-11 h-11 rounded-2xl overflow-hidden ring-2 ring-white/5 group-hover:ring-red-600/40 transition-all duration-300 shadow-lg">
                        <img src={v.avatar} className="w-full h-full object-cover" alt="author avatar" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-sm leading-tight text-white/90 line-clamp-2 group-hover:text-red-500 transition-colors duration-300 tracking-tight">
                        {v.title}
                      </h3>
                      <div className="mt-2.5 space-y-1">
                        <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                          {v.author}
                        </p>
                        <div className="flex items-center text-gray-600 text-[11px] font-bold">
                          <span>{v.views}</span>
                          <span className="mx-2 w-1 h-1 rounded-full bg-gray-800" />
                          <span>{v.time}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-700 hover:text-white transition-colors h-max p-1 rounded-lg hover:bg-white/5">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active = false }) => (
  <div className={`
    flex items-center gap-4 p-3.5 mx-2 rounded-2xl cursor-pointer transition-all duration-300 group
    ${active 
      ? 'bg-red-600/10 text-red-500 shadow-[inset_0_0_20px_rgba(220,38,38,0.05)]' 
      : 'hover:bg-white/5 text-gray-500 hover:text-white'}
  `}>
    <div className={`transition-all duration-300 ${active ? 'scale-110 text-red-600' : 'group-hover:scale-110 group-hover:text-red-500'}`}>
      {icon}
    </div>
    <span className={`text-[12px] font-black tracking-tight ${active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}>
      {label}
    </span>
  </div>
);

export default HomePage;