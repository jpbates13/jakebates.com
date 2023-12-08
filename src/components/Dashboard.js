import React, { useState, useEffect } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../firebase";
import EditProjects from "./EditProjects";


export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("There was a problem logging out");
    }
  }

  const [bio, setBio] = useState("")

  useEffect(() => {
    const docRef = doc(db, "content", "bio");
    getDoc(docRef).then((result) => {
      if (result.exists()) {
        setBio(result.data().content);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
  }, []);

  async function submitBio() {
    const documentRef = doc(db, "content", "bio");
    await updateDoc(documentRef, {
      content: bio
    }).catch((err) => {
      console.log(err)
    });
    navigate("/")
  }


  return (
    <div>
      <Card>
        <Card.Body>
          <h2 className="textcenter mb-4">Dashboard</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: </strong> {currentUser.email}
          <br />
          <strong>Name: </strong> {currentUser.displayName}
        </Card.Body>
      </Card>
      <p></p>
      <Card>
        <Card.Body>
          <h2 className="textcenter mb-4">Content Management</h2>
          <h3>Bio</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Bio: </strong>
          <textarea value={bio} style={{ width: "90%", height: "75%" }} onChange={(e) => { setBio(e.target.value) }}></textarea>
          <Button onClick={submitBio}>Submit Bio</Button>
          <p></p>
          <h3>Projects</h3>
          <EditProjects/>
        </Card.Body>
      </Card>
      <p></p>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </div>
  );
}
