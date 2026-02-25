import api from "../../lib/axios"

const OpenVideoByAdmin = async(id: number) => {
  try {
    const res = await api.post(`/api/admin/videos/${id}`)
    return res.data;
  } catch (error) {
    return null;
  }
}

export default OpenVideoByAdmin
