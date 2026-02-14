import React, { useState } from "react";
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
import Projects from "./ProjectSlider/Projects";

// import Preview from "./Preview";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "../themes";
import OfficeAttendance from "./OfficeAttendance";

const StyledApp = styled.div``;

function App() {
  const [theme, setTheme] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem("theme");
    if (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    } else if (
      !saved &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      return "light";
    }

    return saved || "dark";
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
                      <PrivateRoute adminOnly={true}>
                        <Signup />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute adminOnly={true}>
                        <Dashboard />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/create-post"
                    element={
                      <PrivateRoute adminOnly={true}>
                        <CreatePost />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/edit"
                    element={
                      <PrivateRoute adminOnly={true}>
                        <EditPost />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/drafts"
                    element={
                      <PrivateRoute adminOnly={true}>
                        <Blog isDrafts={true} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/preview"
                    element={
                      <PrivateRoute adminOnly={true}>
                        <Post isDraft={true} />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/office-attendance"
                    element={
                      <PrivateRoute>
                        <OfficeAttendance />
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
