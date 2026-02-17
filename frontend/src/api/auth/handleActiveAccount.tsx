import api from "../../lib/axios";


const handleActiveAccount = async(token:string) => {
  try {
    const res = await api.post("/api/auth/active-account", {token})
    return res.data
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default handleActiveAccount
