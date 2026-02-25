import api from "../../lib/axios";

const handleEditProfile = async (
  username?: string,
  address?: string,
  phone?: string,
  description?: string,
  avatar?: File,
) => {
  const formData = new FormData();
  if (username) formData.append("username", username);
  if (address) formData.append("address", address);
  if (phone) formData.append("phone", phone);
  if (description) formData.append("description", description);
  if (avatar) formData.append("avatar", avatar);
  try {
    const res = await api.post("/api/profile/edit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default handleEditProfile;
