import api from "../../lib/axios";
const GetVideoByUser = async () => {
  try {
    const res = await api.get("/api/video/myself");
    return res.data;
  } catch (error) {
    return [];
  }
};

export default GetVideoByUser;
