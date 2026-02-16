import api from "../../lib/axios";

const handleRegister = async (
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
) => {
  try {
    const res = await api.post("/api/auth/register", {
      username,
      email,
      password,
      confirmPassword,
    });

    if(res.status !== 500 && res.status !== 409){
       return res.data;
    }
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return null;
  }
};

export default handleRegister;
