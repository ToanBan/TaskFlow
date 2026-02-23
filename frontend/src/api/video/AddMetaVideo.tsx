import api from "../../lib/axios"

const AddMetaVideo = async(title:string, description:string, feature_video:File, videoType:string) => {
    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("feature_video", feature_video);
        formData.append("videoType", videoType);

        const res = await api.post("/api/video/addMetaVideo", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        return res.data;
    } catch (error) {
        console.error("Error adding meta video:", error)
        return null;
    }
}

export default AddMetaVideo
