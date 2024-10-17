import React, { useRef } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { UploadAPI } from "../api/UploadAPI";

export default function UploadPage() {
  const customBase64Uploader = (event) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      UploadAPI.uploadFile(arrayBuffer)
        .then((res) => {
          console.log(res.data.message);
        })
        .catch((err) => {
          if (err?.response?.status === 400) {
            console.error(err.response.data.message);
          } else {
            console.log(err);
          }
        });
    };
    reader.readAsArrayBuffer(event.files[0]);
  };

  return (
    <div className="card flex justify-content-center">
      <FileUpload
        mode="basic"
        name="demo[]"
        accept=".xlsx"
        customUpload
        uploadHandler={customBase64Uploader}
        maxFileSize={1000000}
      />
    </div>
  );
}
