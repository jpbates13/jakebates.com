import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [error] = useState("");

  async function handleLogout() {}
  return (
    <div>
      <Card>
        <Card.Body>
          <h2 className="textcenter mb-4">Dashboard</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Email: </strong>
          <br />
          <strong>Name: </strong>
        </Card.Body>
      </Card>
      <p></p>
      <Card>
        <Card.Body>
          <h2 className="textcenter mb-4">Content Management</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <strong>Home: </strong>
          <textarea></textarea>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </div>
  );
}
