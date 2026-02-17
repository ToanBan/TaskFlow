import api from "../../lib/axios";

const handleLogin = async (email: string, password: string) => {
  try {
    const res = await api.post("/api/auth/login", {
      email,
      password,
    });
    console.log(res.data);
    return res.data;
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return null;
  }
};

export default handleLogin;
