import api from "../../lib/axios";

const handleFogotPassword = async(email:string) => {
  try {
   const res = await api.post("/api/auth/forgot-password", {
    email
   })

   return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default handleFogotPassword
