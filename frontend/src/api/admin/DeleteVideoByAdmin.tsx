import api from "../../lib/axios"

const DeleteVideoByAdmin = async (id: number) => {
  try {
    const res = await api.delete(`/api/admin/videos/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
}

export default DeleteVideoByAdmin
