import React, { useState, useEffect } from "react";
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
import Drafts from "./Drafts";
import Preview from "./Preview";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../themes";

function App() {
  document.title = "JakeBates.com";

  const [theme, setTheme] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("theme");
    return saved || "light";
  });

  const themeToggler = () => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
    }
  };

  const StyledApp = styled.div``;
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
          <GlobalStyles />
          <StyledApp>
            <PageLayout themeToggler={themeToggler} theme={theme}>
              <Container style={{ paddingTop: "20px" }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/post" element={<Post />} />
                  <Route
                    path="/projects"
                    element={<Projects theme={theme} />}
                  />
                  <Route
                    path="/signup"
                    element={
                      // Private Route for now because we don't want people signing up
                      <PrivateRoute>
                        {" "}
                        <Signup />{" "}
                      </PrivateRoute>
                    }
                  />
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
                  <Route
                    path="/drafts"
                    element={
                      <PrivateRoute>
                        <Drafts />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/preview"
                    element={
                      <PrivateRoute>
                        <Preview />
                      </PrivateRoute>
                    }
                  />
                </Routes>
              </Container>
            </PageLayout>
          </StyledApp>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
