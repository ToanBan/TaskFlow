import { useState } from "react";
import {
  Share2,
  MoreHorizontal,
  Mail,
  Calendar,
  Lock,
  X,
  Camera,
  ShieldCheck,
  Eye,
  EyeOff,
  MapPin,
  AtSign,
} from "lucide-react";
import AlertSuccess from "../components/common/AlertSucess";
import AlertError from "../components/common/AlertError";
import handleChangePassword from "../api/auth/handleChangePassword";
import { useUser } from "../context/authContext";
import handleEditProfile from "../api/profile/handleEditProfile";
import handleDeleteProfile from "../api/auth/handleDeleteProfile";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import AddMetaVideo from "../api/video/AddMetaVideo";
import ConfirmAddVideo from "../api/video/ConfirmAddVideo";
const Profile = () => {
  const [activeTab, setActiveTab] = useState("videos");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editSection, setEditSection] = useState("general");
  const [showPass, setShowPass] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const { user } = useUser();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const myVideos = [
    {
      id: 1,
      title: "Hệ thống Streaming với NestJS & Docker chuyên sâu",
      thumbnail:
        "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=800&q=80",
      views: "150K",
      date: "2 ngày trước",
      duration: "14:20",
    },
    {
      id: 2,
      title: "Cách setup MinIO cho lưu trữ file cực nhanh",
      thumbnail:
        "https://images.unsplash.com/photo-1605745341112-85968b193ef5?w=800&q=80",
      views: "45K",
      date: "1 tuần trước",
      duration: "10:15",
    },
  ];

  const ChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmNewPassword = formData.get("confirmNewPassword") as string;

    const result = await handleChangePassword(
      oldPassword,
      newPassword,
      confirmNewPassword,
    );

    if (result) {
      setSuccess(true);
      setMessage("Thay Đổi Mật Khẩu Thành Công");
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      form.reset();
    } else {
      setError(true);
      setMessage("Thay Đổi Mật Khẩu Thất Bại");
      setTimeout(() => {
        setError(false);
      }, 3000);
    }
  };

  const EditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const description = formData.get("description") as string;

    const result = await handleEditProfile(
      username,
      address,
      phone,
      description,
    );

    if (result) {
      setSuccess(true);
      setMessage("Chỉnh Sửa Profile Thành Công");
      form.reset();
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } else {
      setError(true);
      setMessage("Chỉnh Sửa Profile Không Thành Công");
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  };

  const DeleteProfile = async () => {
    const result = await Swal.fire({
      title: "Bạn chắc chắn muốn xoá?",
      text: "Tài khoản sẽ bị vô hiệu hoá!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
    });

    if (result.isConfirmed) {
      const response = await handleDeleteProfile();

      if (response) {
        Swal.fire({
          title: "Đã xoá!",
          text: "Tài khoản đã được vô hiệu hoá.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        setMessage("Xóa Tài Khoản Thành Công");
        setTimeout(() => {
          window.location.href = "/login";
        }, 4000);
      }
    }
  };

  const handleUploadVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoFile = formData.get("video") as File;
    const featureVideo = formData.get("feature_video") as File;

    if (!videoFile || !videoFile.type.startsWith("video/")) {
      alert("File không hợp lệ");
      return;
    }

    try {
      const step1 = await AddMetaVideo(
        title,
        description,
        featureVideo,
        videoFile.type.split("/")[1],
      );

      if (!step1) return;

      const uploadRes = await fetch(step1.presignedUploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": videoFile.type,
        },
        body: videoFile,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload MinIO thất bại");
      }

      console.log("Upload lên MinIO xong");
      await ConfirmAddVideo(step1.videoId, videoFile.type.split("/")[1]);
      setSuccess(true);
      setMessage("Upload Video Thành Công");
      setTimeout(() => {setSuccess(false);
      }, 3000);
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra");
    }
  };

  return (
    <>
      <div className="flex-1 h-screen bg-[#050505] text-white overflow-y-auto custom-scrollbar relative font-sans">
        <div className="relative h-64 md:h-80 w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/20" />
          <div className="absolute bottom-6 right-8 flex gap-3">
            <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl font-bold text-xs border border-white/10 hover:bg-white/20 transition-all">
              <Share2 size={16} /> Chia sẻ
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="relative z-20 flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all shadow-lg"
            >
              Đăng Video
            </button>
          </div>
        </div>

        <div className="px-8 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[40px] p-1 bg-gradient-to-tr from-red-600 to-purple-600 shadow-2xl"></div>
              <div className="absolute bottom-3 right-3 bg-green-500 w-6 h-6 rounded-full border-4 border-[#050505] shadow-lg"></div>
            </div>

            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black tracking-tight">
                  {user?.username}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-bold mb-4">
                <AtSign size={14} />
                <span>{user?.username}</span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <div className="bg-white/5 rounded-[32px] p-8 border border-white/5 mb-8">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-4">
                  Mô tả
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {user?.description || "Chưa Có Mô Tả"}
                </p>
              </div>

              <div className="flex border-b border-white/5 gap-8 mb-8">
                {["videos", "liked"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? "text-white" : "text-gray-500 hover:text-white"}`}
                  >
                    {tab === "videos" ? "Nội dung tải lên" : "Đã yêu thích"}
                    {activeTab === tab && (
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600" />
                    )}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-12">
                {myVideos.map((video) => (
                  <div
                    key={video.id}
                    className="group bg-white/5 rounded-3xl overflow-hidden border border-white/5 hover:bg-white/[0.08] transition-all"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black">
                        {video.duration}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-sm mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        <span>
                          {video.views} Views • {video.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
              <div className="bg-white/5 rounded-[32px] p-6 border border-white/5 space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Thông tin liên hệ
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-red-500 shrink-0">
                      <Mail size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-black text-gray-600 tracking-tighter">
                        Địa chỉ Email
                      </p>
                      <p className="text-xs font-bold text-white truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-blue-500 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-black text-gray-600 tracking-tighter">
                        Vị trí
                      </p>
                      <p className="text-xs font-bold text-white leading-tight">
                        {user?.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-purple-500 shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-black text-gray-600 tracking-tighter">
                        Ngày gia nhập
                      </p>
                      <p className="text-xs font-bold text-white">
                        {dayjs(user?.createdAt).format("DD/MM/YYYY")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsEditModalOpen(true);
                  setEditSection("password");
                }}
                className="w-full bg-white/5 border border-white/10 p-5 rounded-[28px] group hover:bg-white/10 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <Lock size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black uppercase tracking-widest text-white">
                      Bảo mật
                    </p>
                    <p className="text-[10px] font-bold text-gray-500">
                      Thay đổi mật khẩu
                    </p>
                  </div>
                </div>
                <MoreHorizontal size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* --- EDIT MODAL --- */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setIsEditModalOpen(false)}
            />

            <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-10 py-8 border-b border-white/5">
                <div className="flex gap-6">
                  <button
                    onClick={() => setEditSection("general")}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${editSection === "general" ? "text-red-500 underline underline-offset-8" : "text-gray-500"}`}
                  >
                    Thông tin
                  </button>
                  <button
                    onClick={() => setEditSection("password")}
                    className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${editSection === "password" ? "text-red-500 underline underline-offset-8" : "text-gray-500"}`}
                  >
                    Mật khẩu
                  </button>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-10 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {editSection === "general" ? (
                  <form onSubmit={EditProfile} id="editProfileForm">
                    <div className="space-y-8">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                            Avatar
                          </label>
                          <div className="relative">
                            <Camera
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                              size={14}
                            />
                            <input
                              name="avatar"
                              type="file"
                              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                            Username
                          </label>
                          <div className="relative">
                            <AtSign
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                              size={14}
                            />
                            <input
                              name="username"
                              type="text"
                              defaultValue={user?.username}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                            Địa chỉ
                          </label>
                          <input
                            name="address"
                            type="text"
                            defaultValue={user?.address}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                            Phone
                          </label>
                          <input
                            pattern="[0-9]*"
                            inputMode="numeric"
                            name="phone"
                            type="text"
                            defaultValue={user?.phone}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                            Mô tả ngắn
                          </label>
                          <textarea
                            name="description"
                            rows={3}
                            defaultValue={user.description}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={ChangePassword} id="changePasswordForm">
                    <div className="space-y-6">
                      <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-[24px] flex items-center gap-4">
                        <ShieldCheck className="text-red-500" size={24} />
                        <p className="text-[11px] text-gray-400 font-medium">
                          Bảo vệ tài khoản bằng mật khẩu mạnh.
                        </p>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-2 relative">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                            Mật khẩu hiện tại
                          </label>
                          <input
                            name="oldPassword"
                            placeholder="••••••••"
                            type={showPass ? "text" : "password"}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                          />
                          <button
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-5 top-11 text-gray-500"
                          >
                            {showPass ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                            Mật khẩu mới
                          </label>
                          <input
                            name="newPassword"
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                            Xác thực mật khẩu mới
                          </label>
                          <input
                            name="confirmNewPassword"
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              <div className="p-10 bg-white/[0.01] border-t border-white/5 flex gap-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all bg-white/5"
                >
                  Hủy
                </button>

                <button
                  onClick={DeleteProfile}
                  className="flex-[2] bg-red-600 py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-900/20 tracking-[0.2em]"
                >
                  XÓA TÀI KHOẢN
                </button>

                <button
                  type="submit"
                  form={
                    editSection === "general"
                      ? "editProfileForm"
                      : "changePasswordForm"
                  }
                  className="flex-[2] bg-red-600 py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-red-900/20 tracking-[0.2em]"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </div>
          </div>
        )}

        {isUploadModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setIsUploadModalOpen(false)}
            />

            <div className="relative bg-[#0a0a0a] border border-white/10 w-full max-w-xl rounded-[40px] shadow-2xl p-10">
              <h2 className="text-lg font-bold mb-6">Đăng Video</h2>

              <form className="space-y-6" onSubmit={handleUploadVideo}>
                <div>
                  <label className="text-xs font-bold text-gray-400">
                    Tiêu đề
                  </label>
                  <input
                    name="title"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400">
                    File video
                  </label>
                  <input
                    name="video"
                    type="file"
                    accept="video/*"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400">
                    Feature Video
                  </label>
                  <input
                    name="feature_video"
                    type="file"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="flex-1 py-4 rounded-2xl text-xs font-bold bg-white/5"
                  >
                    Huỷ
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 py-4 rounded-2xl font-bold text-xs hover:bg-blue-700"
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {success && <AlertSuccess message={message} />}
      {error && <AlertError message={message} />}
    </>
  );
};

export default Profile;
