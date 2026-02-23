import api from "../../lib/axios"
const ConfirmAddVideo = async (videoId: string, videoType: string) => {
  try {
    const res = await api.post(`/api/video/${videoId}/confirm`, {
      videoType
    });
    return res.data;
  } catch (error) {
    console.error("Error confirming video:", error);
    return null;
  }
}

export default ConfirmAddVideo
