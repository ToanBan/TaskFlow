import api from "../../lib/axios"

const GetCountStatusVideo = async() => {
  try {
    const res = await api.get("/api/admin/count-status-video");
    return res.data;
  } catch (error) {
    return null;
  }
}

export default GetCountStatusVideo
