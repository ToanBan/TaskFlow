import React, { useEffect, useState } from "react";
import {
  Play,
  Search,
  RefreshCw,
  Trash2,
  ExternalLink,
  Video,
} from "lucide-react";
import GetAllVideoAdmin from "../api/admin/GetAllVideoAdmin";
import GetCountStatusVideo from "../api/admin/GetCountStatusVideo";
import DeleteVideoByAdmin from "../api/admin/DeleteVideoByAdmin";
import OpenVideoByAdmin from "../api/admin/OpenVideoByAdmin";
import Swal from "sweetalert2";
type VideoStatus = "UPLOADED" | "PROCESSING" | "COMPLETED" | "FAILED";

interface VideoProps {
  id: number;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  thumbnailUrl: string;
}

const renderStatus = (status: string) => {
  switch (status) {
    case "UPLOADED":
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          Uploaded
        </span>
      );

    case "PROCESSING":
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          Processing
        </span>
      );

    case "READY":
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Ready
        </span>
      );

    case "FAILED":
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          Failed
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
          Unknown
        </span>
      );
  }
};

const Admin: React.FC = () => {
  const [videos, setVideos] = useState<VideoProps[]>([]);
  const [countStatus, setCountStatus] = useState({
    uploaded: 0,
    processing: 0,
    ready: 0,
    failed: 0,
  });

  const fetchCountStatus = async () => {
    const data = await GetCountStatusVideo();
    setCountStatus(data);
  };

  const fetchVideos = async () => {
    const data = await GetAllVideoAdmin();
    setVideos(data);
  };

  useEffect(() => {
    fetchVideos();
    fetchCountStatus();
  }, []);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<VideoStatus | "ALL">("ALL");
  const loading = false;

  const handleDeleteVideo = async (id: number) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa video này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Có, xóa ngay!",
      cancelButtonText: "Hủy bỏ",
    });
    if (result.isConfirmed) {
      const res = await DeleteVideoByAdmin(id);
      if (res) {
        Swal.fire("Đã xóa!", "Video đã được xóa thành công.", "success");
        fetchVideos();
        fetchCountStatus();
      } else {
        Swal.fire("Lỗi!", "Đã có lỗi xảy ra khi xóa video.", "error");
      }
    }
  };

  const handleOpenVideo = async (id: number) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn mở video này?",
      text: "Hành động này sẽ thay đổi trạng thái video thành READY!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Có, mở video!",
      cancelButtonText: "Hủy bỏ",
    });
    if (result.isConfirmed) {
      const res = await OpenVideoByAdmin(id);
      if (res) {
        Swal.fire("Đã mở!", "Video đã được mở thành công.", "success");
        fetchVideos();
        fetchCountStatus();
      } else {
        Swal.fire("Lỗi!", "Đã có lỗi xảy ra khi mở video.", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
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
            <p className="text-slate-500 mt-1 font-medium italic">
              Quản lý hạ tầng transcoding & lưu trữ MinIO
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 shadow-sm transition-all active:scale-95">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Làm mới hệ thống
          </button>
        </header>

        <div className="bg-white p-5 rounded-t-2xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
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
              onChange={(e) =>
                setFilterStatus(e.target.value as VideoStatus | "ALL")
              }
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="UPLOADED">Chờ xử lý</option>
              <option value="PROCESSING">Đang xử lý</option>
              <option value="COMPLETED">Đã hoàn thành</option>
              <option value="FAILED">Lỗi hệ thống</option>
            </select>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {/* Total */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              Tổng video
            </p>
            <p className="text-3xl font-black mt-2 text-slate-800">
              {videos.length}
            </p>
          </div>

          {/* Uploaded */}
          <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-amber-500 font-bold">
              Uploaded
            </p>
            <p className="text-3xl font-black mt-2 text-amber-600">
              {countStatus.uploaded}
            </p>
          </div>

          {/* Processing */}
          <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-blue-500 font-bold">
              Processing
            </p>
            <p className="text-3xl font-black mt-2 text-blue-600">
              {countStatus.processing}
            </p>
          </div>

          {/* Ready */}
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-emerald-500 font-bold">
              Ready
            </p>
            <p className="text-3xl font-black mt-2 text-emerald-600">
              {countStatus.ready}
            </p>
          </div>

          {/* Failed */}
          <div className="bg-rose-50 rounded-2xl p-5 border border-rose-200 shadow-sm">
            <p className="text-xs uppercase tracking-widest text-rose-500 font-bold">
              Failed
            </p>
            <p className="text-3xl font-black mt-2 text-rose-600">
              {countStatus.failed}
            </p>
          </div>
        </div>
        {/* Danh sách Video */}
        <div className="bg-white rounded-b-2xl shadow-xl border-x border-b border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-y border-slate-200">
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Xem trước
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Thông tin chi tiết
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-center">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    Thời gian
                  </th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {videos.map((video) => (
                  <tr key={video.id}>

                    <td className="px-6 py-5">
                      <div className="relative w-36 aspect-video rounded-xl bg-slate-200 overflow-hidden border border-slate-200">
                        <img
                          src={`${import.meta.env.VITE_IMAGES_URL}/${video.thumbnailUrl}`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                          <Play fill="white" className="text-white" size={28} />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="text-base font-bold text-slate-800">
                        {video.title}
                      </div>
                      <div className="text-sm text-slate-400 mt-1">
                        {video.description}
                      </div>
                    </td>

                    <td className="px-6 py-5 text-center">
                      {renderStatus(video.status)}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {new Date(video.createdAt).toLocaleString("vi-VN")}
                    </td>

                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenVideo(video.id)}
                          className="p-2.5 bg-white border border-slate-200 text-indigo-600 rounded-xl shadow-sm"
                        >
                          <ExternalLink size={18} />
                        </button>

                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="p-2.5 bg-white border border-slate-200 text-rose-600 rounded-xl shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
