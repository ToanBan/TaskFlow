import api from "../../lib/axios";

const handleLogin = async (email: string, password: string) => {
  try {
    const res = await api.post("/api/auth/login", {
      email,
      password,
    });

    if (res.status !== 500 && res.status !== 409) {
      return res.data;
    }
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return null;
  }
};

export default handleLogin;
