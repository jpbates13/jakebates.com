import React from "react";
import "../styles/App.scss";
import Github from "../images/svg/social-1_logo-github.svg";
import LinkedIn from "../images/svg/social-1_logo-linkedin.svg";

export default function PageLayout({ children }) {
  const currentYear = new Date().getFullYear();

  return (
    <div>
      <div class="container page-content">
        <div class="header page-header">
          <div class="header-content">
            <div class="pageTitle">
              <h1>Jake Bates</h1>
            </div>
            <div class="pageMenu">
              <nav class="navbar navbar-expand-lg navbar-light">
                <button
                  class="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span class="mobileMenuIcon navbar-toggler-icon"></span>
                </button>

                <div
                  class="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul class="navbar-nav ml-auto">
                    <li class="nav-item active">
                      <a class="nav-link" href="/">
                        <b>Home</b>
                      </a>
                    </li>
                    <li class="nav-item active">
                      <a class="nav-link" href="/projects.html">
                        <b>Projects</b>
                      </a>
                    </li>
                    <li class="nav-item active">
                      <a class="nav-link" href="/blog">
                        <b>Blog</b>
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
          <hr />
        </div>
        <div class="pageContent">{children}</div>
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
