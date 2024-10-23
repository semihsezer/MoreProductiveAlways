import { getAuthAPIInstance } from "./Base";
const authAPI = getAuthAPIInstance();

export const UploadAPI = {
  uploadFile: (arrayBuffer) => {
    try {
      const formData = new FormData();
      formData.append("file", new Blob([arrayBuffer]), "temp_file");
      return authAPI.post("/api/bulk/upload_excel", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.log(err);
    }
  },
  loadFromSource: () => {
    try {
      return authAPI.post("/api/bulk/load_from_source");
    } catch (err) {
      console.log(err);
    }
  },
  exportFile: () => {
    try {
      return authAPI.get("/api/bulk/export_excel", { responseType: "blob" });
    } catch (err) {
      console.log(err);
    }
  },
};
