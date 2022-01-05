import React from "react";
import "../styles/App.scss";
import Github from "../images/svg/social-1_logo-github.svg";
import LinkedIn from "../images/svg/social-1_logo-linkedin.svg";
import { Navbar, Nav, Container } from "react-bootstrap";
import Resume from "../assets/resume.pdf";

export default function PageLayout({ children }) {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <div class="container page-content">
        <div class="header page-header">
          <div class="header-content">
            <a href="/" style={{ textDecoration: "none", color: "black" }}>
              <div class="pageTitle">
                <h1>Jake Bates</h1>
              </div>
            </a>
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
                      <Nav.Link class="nav-item active" href="/blog">
                        <b>Blog</b>
                      </Nav.Link>
                      <Nav.Link class="nav-item active" href="/projects">
                        <b>Projects</b>
                      </Nav.Link>
                      <Nav.Link class="nav-item active" href={Resume}>
                        <b>Resume</b>
                      </Nav.Link>
                    </Nav>
                  </Navbar.Collapse>
                </Container>
              </Navbar>
            </div>
          </div>
        </div>
        <div class="current-content">{children}</div>
      </div>
      <footer class="footer page-footer text-center block third bg-light">
        <br />
        <div class="social-icon-set">
          <div class="social-icon">
            <a href="https://www.linkedin.com/in/joshua-jake-bates/">
              <img src={LinkedIn} />
            </a>
          </div>
          <div class="social-icon">
            <a href="https://github.com/jpbates13">
              <img src={Github} />
            </a>
          </div>
        </div>
        <br />
        <p>
          Copyright &copy; {currentYear} <a href="/index.html">JakeBates.com</a>
        </p>
      </footer>
    </div>
  );
}
