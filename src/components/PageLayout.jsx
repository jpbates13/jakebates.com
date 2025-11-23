import React, { useEffect, useState } from "react";
import "../styles/App.scss";
import Github from "../images/svg/social-1_logo-github.svg";
import LinkedIn from "../images/svg/social-1_logo-linkedin.svg";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaMoon, FaSun } from "react-icons/fa";
import CookieConsent from "react-cookie-consent";
import { Tooltip } from "@mui/material";
import { getResume as getResumeService, getBlogEnabled } from "../services/firestoreService";

export default function PageLayout(props) {
  const currentYear = new Date().getFullYear();
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();

  function getResume() {
    //get resume from firebase
    getResumeService().then((result) => {
      if (result.exists()) {
        // openBase64PDFInNewTab(result.data().base64);
        downloadBase64PDF(result.data().base64);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
  }

  //get the blog-enabled document from the content collection
  const [blogEnabled, setBlogEnabled] = useState(false);
  useEffect(() => {
    getBlogEnabled().then((result) => {
      if (result.exists()) {
        setBlogEnabled(result.data().blogEnabled);
      } else {
        console.log("No such document!");
      }
    });
  }, []);

  function downloadBase64PDF(base64Data) {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "resume.pdf";
    link.href = url;
    link.click();
    const newTab = window.open();
    newTab.document.write(
      '<iframe src="' +
        url +
        '" style="width:100%; height:100%;" frameborder="0"></iframe>'
    );
  }

  const navigate = useNavigate();

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
      <CookieConsent>
        This website uses cookies to improve user experience and analyze website
        traffic.
      </CookieConsent>
      <div class="container page-content">
        <div class="header page-header">
          <div class="header-content">
            <a href="/" style={{ textDecoration: "none" }}>
              <div class="pageTitle">
                <h1 class="pageTitleText">Jake Bates</h1>
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
                        {currentUser &&
                          currentUser.email === "jpbates13@gmail.com" && (
                            <>
                              <Nav.Link
                                class="nav-item active"
                                href="/dashboard"
                              >
                                <b>Dashboard</b>
                              </Nav.Link>
                              <Nav.Link
                                class="nav-item active"
                                href="/create-post"
                              >
                                <b>Create Post</b>
                              </Nav.Link>
                              <Nav.Link class="nav-item active" href="/drafts">
                                <b>Drafts</b>
                              </Nav.Link>
                            </>
                          )}
                        <Nav.Link
                          class="nav-item active"
                          href="/office-attendance"
                        >
                          <b>Office Attendance</b>
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
                      <Nav.Link class="nav-item active" onClick={getResume}>
                        <b>Resume</b>
                      </Nav.Link>
                      {blogEnabled && (
                        <Nav.Link class="nav-item active" href="/blog">
                          <b>Blog</b>
                        </Nav.Link>
                      )}
                    </Nav>
                    <Tooltip title="Change theme">
                      <Button onClick={props.themeToggler}>
                        {props.theme === "light" ? <FaSun /> : <FaMoon />}
                      </Button>
                    </Tooltip>
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
          Copyright &copy; {currentYear} <a href="/">JakeBates.com</a> Icons by{" "}
          <a target="_blank" href="https://icons8.com">
            Icons8
          </a>
        </p>
      </footer>
    </div>
  );
}
