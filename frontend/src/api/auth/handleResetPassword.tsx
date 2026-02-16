import api from "../../lib/axios";
const handleResetPassword = async(newPassword:string, confirmNewPassword:string, token:string) => {
  try {
    const res = await api.post("/api/auth/reset-password", {
        newPassword, confirmNewPassword, token
    })
    
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default handleResetPassword
