import api from "../../lib/axios";

const GetAllVideoAdmin = async () => {
  try {
    const res = await api.get("/api/admin/all-video");
    return res.data;
  } catch (error) {
    return [];
  }
};

export default GetAllVideoAdmin;
