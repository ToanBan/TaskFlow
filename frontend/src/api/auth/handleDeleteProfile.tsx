import api from "../../lib/axios";


const handleDeleteProfile = async() => {
    try {
        const res = await api.delete("/api/profile/delete");
        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default handleDeleteProfile
