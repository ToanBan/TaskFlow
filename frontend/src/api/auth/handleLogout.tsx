import api from "../../lib/axios";

const handleLogout = async() => {
  try {
    const res = await api.post("/api/auth/logout");
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default handleLogout
