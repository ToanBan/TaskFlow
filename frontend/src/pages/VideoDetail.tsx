import { useParams } from "react-router-dom";
import Hls from "hls.js";
import { useEffect, useState } from "react";
import GetVideoDetail from "../api/video/GetVideoDetail";
const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);

  const fetchVideoDetail = async () => {
    if (id) {
      const data = await GetVideoDetail(Number(id));
      setVideo(data);
    }
  };

  useEffect(() => {
    fetchVideoDetail();
  }, []);

  useEffect(() => {
    if (!video) return;

    const videoElement = document.getElementById(
      "video-player",
    ) as HTMLVideoElement;

    if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = `${import.meta.env.VITE_IMAGES_URL}/${video.processedUrl}`;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(video.processedUrl);
      hls.attachMedia(videoElement);

      return () => hls.destroy();
    }
  }, [video]);

  if (!video) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto py-10">
      <video id="video-player" controls className="w-full rounded-2xl" />

      <h1 className="text-2xl font-bold mt-6">{video.title}</h1>
      <p className="text-gray-400 mt-2">{video.user.username}</p>

    </div>
  );
};

export default VideoDetail;
