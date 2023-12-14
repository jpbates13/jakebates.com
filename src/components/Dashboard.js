import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../firebase";
import EditProjects from "./EditProjects";
import ResumeUpload from "./ResumeUpload";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("bio");

  useEffect(() => {
    const docRef = doc(db, "content", "bio");
    getDoc(docRef).then((result) => {
      if (result.exists()) {
        setBio(result.data().content);
      } else {
        console.log("No such document!");
      }
    });
  }, []);

  async function submitBio() {
    const documentRef = doc(db, "content", "bio");
    await updateDoc(documentRef, {
      content: bio,
    }).catch((err) => {
      console.log(err);
    });
    navigate("/");
  }

  function handleComponentChange(component) {
    setSelectedComponent(component);
  }

  return (
    <div>
      <h2 className="textcenter mb-4">Content Management</h2>
      <hr />
      <div>
        <Button
          variant={selectedComponent === "bio" ? "primary" : "outline-primary"}
          onClick={() => handleComponentChange("bio")}
        >
          Bio
        </Button>{" "}
        <Button
          variant={
            selectedComponent === "projects" ? "primary" : "outline-primary"
          }
          onClick={() => handleComponentChange("projects")}
        >
          Projects
        </Button>{" "}
        <Button
          variant={
            selectedComponent === "resume" ? "primary" : "outline-primary"
          }
          onClick={() => handleComponentChange("resume")}
        >
          Resume Upload
        </Button>
      </div>
      <p></p>
      {selectedComponent === "bio" && (
        <>
          <h3>Bio</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <textarea
            value={bio}
            style={{ width: "90%", height: "75%" }}
            onChange={(e) => {
              setBio(e.target.value);
            }}
            rows={6}
          ></textarea>
          <p />
          <Button onClick={submitBio}>Submit Bio</Button>
          <p></p>
        </>
      )}
      {selectedComponent === "projects" && (
        <>
          <h3>Projects</h3>
          <EditProjects />
          <p></p>
        </>
      )}
      {selectedComponent === "resume" && (
        <>
          <h3>Resume Upload</h3>
          <ResumeUpload />
          <p></p>
        </>
      )}
      <div className="w-100 text-center mt-2">
        <Button variant="link" href="/logout">
          Log out
        </Button>
      </div>
    </div>
  );
}
