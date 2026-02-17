import api from "../../lib/axios";

const handleEditProfile = async (
  username?: string,
  address?: string,
  phone?: string,
  description?: string,
) => {
  try {
    const res = await api.post("/api/profile/edit", {
      username,
      address,
      phone,
      description,
    });

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default handleEditProfile;
