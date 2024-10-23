import React, { useRef } from "react";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import { UploadAPI } from "../api/UploadAPI";
import { Button } from "primereact/button";

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

  const downloadFile = async () => {
    try {
      UploadAPI.exportFile().then((response) => {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "mpa_export.xlsx";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("There was a problem with exporting data:", error);
    }
  };

  const loadFromSource = async () => {
    try {
      UploadAPI.loadFromSource().then((response) => {
        console.log("Loaded from source successfully!");
      });
    } catch (error) {
      console.error("There was a problem with loading from source:", error);
    }
  };

  return (
    <div className="card flex justify-content-center">
      <h3>Upload From Excel:</h3>
      <FileUpload
        mode="basic"
        name="demo[]"
        accept=".xlsx"
        customUpload
        uploadHandler={customBase64Uploader}
        maxFileSize={1000000}
        chooseLabel="Upload Excel"
      />
      <br />
      <h3>Export Data:</h3>
      <Button onClick={downloadFile} label="Export Data"></Button>
      <br />
      <h3>Load from Source:</h3>
      <Button onClick={loadFromSource} label="Load from Source"></Button>
    </div>
  );
}
