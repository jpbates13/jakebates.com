import React, { useState } from "react";
import Signup from "./pages/public/Signup";
import Login from "./pages/public/Login";
import Home from "./pages/public/Home";
import { Container } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/private/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Blog from "./pages/public/Blog";
import Post from "./components/Post";
import CreatePost from "./pages/private/CreatePost";
import PageLayout from "./components/PageLayout";
import EditPost from "./pages/private/EditPost";
import Projects from "./pages/public/Projects";
import Drafts from "./pages/private/Drafts";
import Preview from "./components/Preview";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "./themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const StyledApp = styled.div``;
  return (
    <>
      <Router>
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
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
