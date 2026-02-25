import api from "../../lib/axios"

const GetAllVideo = async() => {
  try {
    const res = await api.get('/api/video');
    return res.data;
  } catch (error) {
    return [];
  }
}

export default GetAllVideo
