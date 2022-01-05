import React from "react";
import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute";
import Blog from "./Blog";
import Post from "./Post";
import CreatePost from "./CreatePost";
import PageLayout from "./PageLayout";
import EditPost from "./EditPost";
import Projects from "./Projects";
import Resume from "../assets/resume.pdf";
function App() {
  return (
    <PageLayout>
      <Container style={{ paddingTop: "20px" }}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/post" element={<Post />} />
              <Route path="/projects" element={<Projects />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/create-post"
                element={
                  <PrivateRoute>
                    <CreatePost />
                  </PrivateRoute>
                }
              />
              <Route
                path="/edit"
                element={
                  <PrivateRoute>
                    <EditPost />
                  </PrivateRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </Router>
      </Container>
    </PageLayout>
  );
}

export default App;
