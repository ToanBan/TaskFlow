import api from "../../lib/axios"

const DeleteVideo = async(videoId:string) => {
  try {
    const res = await api.delete(`/api/video/${videoId}`)
    return res.data
  } catch (error) {
    return null;
  }
}

export default DeleteVideo
