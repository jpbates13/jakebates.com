import React from "react";
import { useState } from "react";
import { updateResume } from "../services/firestoreService";
import { Input } from "@mui/material";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState(null);
  const navigate = useNavigate();

  const upload = () => {
    // Update the "base64" attribute in the "resume" document

    updateResume(base64)
      .then(() => {
        console.log("Base64 string updated successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error updating base64 string: ", error);
      });
  };

  return (
    <div>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Control
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
            fileToBase64(e.target.files[0]).then((result) => {
              //we drop the data:application/octet-stream;base64, prefix so we can set it to pdf on download
              setBase64(result.split(",")[1]);
            });
          }}
        />
      </Form.Group>
      <Button onClick={upload}>Upload</Button>
    </div>
  );
}

const fileToBase64 = (filename, filepath) => {
  return new Promise((resolve) => {
    var file = new File([filename], filepath);
    var reader = new FileReader();
    // Read file content on file loaded event
    reader.onload = function (event) {
      resolve(event.target.result);
    };

    // Convert data to base64
    reader.readAsDataURL(file);
  });
};

export default ResumeUpload;
