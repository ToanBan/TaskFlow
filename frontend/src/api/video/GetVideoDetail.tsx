import api from "../../lib/axios"

const GetVideoDetail = async(videoId: number) => {
  try {
    const res = await api.get(`/api/video/${videoId}`);
    return res.data;
  } catch (error) {
    return null;
  }
}

export default GetVideoDetail
