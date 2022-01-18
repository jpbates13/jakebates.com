import React, { useState, useEffect } from "react";
import "../styles/App.scss";
import Github from "../images/svg/social-1_logo-github.svg";
import LinkedIn from "../images/svg/social-1_logo-linkedin.svg";
import { Navbar, Nav, Container } from "react-bootstrap";
import Resume from "../assets/resume.pdf";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaMoon, FaSun } from "react-icons/fa";

export default function PageLayout(props) {
  const currentYear = new Date().getFullYear();
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("theme", props.theme);
  }, []);

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch {
      setError("There was a problem logging out");
    }
  }
  return (
    <div>
      <div class="container page-content">
        <div class="header page-header">
          <div class="header-content">
            <a href="/" style={{ textDecoration: "none" }}>
              <div class="pageTitle">
                <h1>Jake Bates</h1>
              </div>
            </a>
            {error && <p>error</p>}
            {currentUser && (
              <div>
                <Navbar
                  collapseOnSelect
                  expand="sm"
                  class="navbar navbar-expand-lg"
                >
                  <Container>
                    <Navbar.Toggle
                      class="navbar-toggler"
                      type="button"
                      data-toggle="collapse"
                      data-target="#navbarSupportedContent"
                      aria-controls="navbarSupportedContent"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                    >
                      <span class="mobileMenuIcon navbar-toggler-icon"></span>
                    </Navbar.Toggle>

                    <Navbar.Collapse
                      class="collapse navbar-collapse"
                      id="navbarSupportedContent"
                    >
                      <Nav>
                        <Nav.Link class="nav-item active" href="/dashboard">
                          <b>Dashboard</b>
                        </Nav.Link>
                        <Nav.Link class="nav-item active" href="/create-post">
                          <b>Create Post</b>
                        </Nav.Link>
                        <Nav.Link class="nav-item active" href="/drafts">
                          <b>Drafts</b>
                        </Nav.Link>
                        <Nav.Link
                          class="nav-item active"
                          onClick={handleLogout}
                        >
                          <b>Log Out</b>
                        </Nav.Link>
                      </Nav>
                    </Navbar.Collapse>
                  </Container>
                </Navbar>
              </div>
            )}
            <div class="pageMenu">
              <Navbar
                collapseOnSelect
                expand="sm"
                class="navbar navbar-expand-lg navbar-light"
              >
                <Container>
                  <Navbar.Toggle
                    class="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span class="mobileMenuIcon navbar-toggler-icon"></span>
                  </Navbar.Toggle>

                  <Navbar.Collapse
                    class="collapse navbar-collapse"
                    id="navbarSupportedContent"
                  >
                    <Nav>
                      <Nav.Link class="nav-item active" href="/">
                        <b>Home</b>
                      </Nav.Link>
                      {/* Temporarily disabling blog until we have actual content */}
                      {/* <Nav.Link class="nav-item active" href="/blog">
                        <b>Blog</b>
                      </Nav.Link> */}
                      <Nav.Link class="nav-item active" href="/projects">
                        <b>Projects</b>
                      </Nav.Link>
                      <Nav.Link class="nav-item active" href={Resume}>
                        <b>Resume</b>
                      </Nav.Link>
                    </Nav>
                    <Button onClick={props.themeToggler}>
                      {props.theme === "light" ? <FaSun /> : <FaMoon />}
                    </Button>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </div>
          </div>
        </div>
        <div class="current-content">{props.children}</div>
      </div>
      <footer class="footer page-footer text-center block third">
        <br />
        <div class="social-icon-set">
          <div class="social-icon">
            <a href="https://www.linkedin.com/in/joshua-jake-bates/">
              <img
                class={props.theme === "dark" ? "social-svg-lighter" : ""}
                alt=""
                src={LinkedIn}
              />
            </a>
          </div>
          <div class="social-icon">
            <a href="https://github.com/jpbates13">
              <img
                class={props.theme === "dark" ? "social-svg-lighter" : ""}
                alt=""
                src={Github}
              />
            </a>
          </div>
        </div>
        <br />
        <p>
          Copyright &copy; {currentYear} <a href="/">JakeBates.com</a>
        </p>
      </footer>
    </div>
  );
}
