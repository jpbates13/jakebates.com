import React from "react";
import { useState } from "react";
import {
  updateDoc,
  doc,
  writeBatch,
  deleteDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "firebase/firestore";
import db from "../firebase";

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [base64, setBase64] = useState(null);

  const upload = () => {
    // Update the "base64" attribute in the "resume" document

    const documentRef = doc(db, "resume", "resume");

    updateDoc(documentRef, {
      base64: base64,
    })
      .then(() => {
        console.log("Base64 string updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating base64 string: ", error);
      });
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          setFile(e.target.files[0]);
          fileToBase64(e.target.files[0]).then((result) => {
            //we drop the data:application/octet-stream;base64, prefix so we can set it to pdf on download
            setBase64(result.split(",")[1]);
          });
        }}
      />
      <img src={base64} />
      <button onClick={upload}>Upload</button>
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
