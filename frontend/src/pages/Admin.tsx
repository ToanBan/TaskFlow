import React, { useState, useEffect } from 'react';
import { 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Search, 
  RefreshCw, 
  Trash2, 
  ExternalLink,
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import GetAllVideoAdmin from '../api/admin/GetAllVideoAdmin';
import GetCountStatusVideo from '../api/admin/GetCountStatusVideo';
// --- Interfaces & Types ---
type VideoStatus = 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

interface VideoProps{
  id:number;
  title:string;
  description:string;
  status:string;
  createdAt:string;
  thumbnailUrl:string;
}

interface CountStatusResponse {
  uploaded: number;
  processing: number;
  ready: number;
  failed: number;
}



const Admin: React.FC = () => {
  // --- State ---
  const [videos, setVideos] = useState<VideoProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<VideoStatus | 'ALL'>('ALL');
  const [countStatus, setCountStatus] = useState<CountStatusResponse>({ uploaded: 0, processing: 0, ready: 0, failed: 0 });

  const fetchVideos = async() => {
    const data = await GetAllVideoAdmin();
    setVideos(data);
  }

  const fetchCountStatus = async() => {
    const data = await GetCountStatusVideo();
    setCountStatus(data);
  }

  useEffect(()=>{
    fetchVideos();
    fetchCountStatus();
  }, []);


  console.log(videos);
  console.log(countStatus);

  // --- Logic Xử lý ---
 

  const getStatusUI = (status: VideoStatus) => {
    const baseClass = "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm w-fit";
    switch (status) {
      case 'COMPLETED':
        return <div className={`${baseClass} bg-emerald-100 text-emerald-700`}><CheckCircle size={14}/> Hoàn thành</div>;
      case 'PROCESSING':
        return <div className={`${baseClass} bg-sky-100 text-sky-700 animate-pulse`}><RefreshCw size={14} className="animate-spin"/> Đang xử lý</div>;
      case 'FAILED':
        return <div className={`${baseClass} bg-rose-100 text-rose-700`}><AlertCircle size={14}/> Lỗi</div>;
      default:
        return <div className={`${baseClass} bg-slate-100 text-slate-700`}><Clock size={14}/> Chờ xử lý</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
      {/* Container chính */}
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <Video size={28} />
              </div>
              Video Console
            </h1>
            <p className="text-slate-500 mt-1 font-medium italic">Quản lý hạ tầng transcoding & lưu trữ MinIO</p>
          </div>
          <button 
            onClick={fetchVideos}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 shadow-sm transition-all active:scale-95"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> 
            Làm mới hệ thống
          </button>
        </header>

        {/* Thống kê nhanh */}
       

        {/* Toolbar điều khiển */}
        <div className="bg-white p-5 rounded-t-2xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm theo tiêu đề video..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium placeholder:text-slate-400 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <select 
              className="flex-1 md:w-48 px-4 py-3 bg-slate-50 border-none rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 appearance-none cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as VideoStatus | 'ALL')}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="UPLOADED">Chờ xử lý</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              <option value="FAILED">Lỗi hệ thống</option>
            </select>
          </div>
        </div>

        {/* Danh sách Video */}
        <div className="bg-white rounded-b-2xl shadow-xl border-x border-b border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-y border-slate-200">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Xem trước</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Thông tin chi tiết</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-8"><div className="h-10 bg-slate-100 rounded-lg w-full"></div></td>
                    </tr>
                  ))
                ) : videos.length > 0 ? (
                  videos.map((video) => (
                    <tr key={video.id} className="group hover:bg-slate-50/80 transition-all">
                      <td className="px-6 py-5">
                        <div className="relative w-36 aspect-video rounded-xl bg-slate-200 overflow-hidden shadow-sm border border-slate-200">
                          <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play fill="white" className="text-white" size={28} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-base font-bold text-slate-800 leading-tight">{video.title}</div>
                        <div className="text-sm text-slate-400 mt-1 line-clamp-1">{video.description}</div>
                        <div className="inline-block mt-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-mono font-bold tracking-tighter">
                          UUID: {video.id}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          {getStatusUI(video.status as VideoStatus)}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700">{new Date(video.createdAt).toLocaleDateString('vi-VN')}</span>
                          <span className="text-xs text-slate-400 uppercase tracking-tighter">{new Date(video.createdAt).toLocaleTimeString('vi-VN')}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 rounded-xl shadow-sm transition-all">
                            <ExternalLink size={18} />
                          </button>
                          <button className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 rounded-xl shadow-sm transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="p-4 bg-slate-50 rounded-full text-slate-300">
                          <Video size={48} />
                        </div>
                        <p className="text-slate-500 font-bold">Không tìm thấy dữ liệu phù hợp</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer phân trang */}
          <footer className="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Trang 1 / 1 — <span className="text-slate-600 italic font-medium lowercase">kết quả: {videos.length}</span>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed shadow-sm">
                <ChevronLeft size={18} />
              </button>
              <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 cursor-not-allowed shadow-sm">
                <ChevronRight size={18} />
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Admin;