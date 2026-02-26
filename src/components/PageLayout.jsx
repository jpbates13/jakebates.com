import React, { useEffect, useState, useRef } from "react";
import "../styles/App.scss";
import {
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaGithub,
  FaLinkedin,
  FaUserCircle,
  FaCaretDown,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

import CookieConsent from "react-cookie-consent";
import { Tooltip } from "@mui/material";
import {
  getResume as getResumeService,
  getBlogEnabled,
} from "../services/firestoreService";
import styled from "styled-components";

const HeaderWrapper = styled.header`
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
  background: ${(props) => props.theme.body + "cc"};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid ${(props) => props.theme.fontColor}1a;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
`;

const HeaderContent = styled.div`
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
`;

const Logo = styled.a`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${(props) => props.theme.titleColor};
  text-decoration: none;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;

  &:hover {
    color: ${(props) => props.theme.titleColor};
    text-decoration: none;
  }
`;

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-left: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a`
  color: ${(props) => props.theme.fontColor};
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  margin-top: 0 !important;

  &:hover {
    background-color: ${(props) => props.theme.linkColor + "20"};
    color: ${(props) => props.theme.linkColor};
    text-decoration: none;
  }
`;

// ... keep ThemeToggle, MobileMenuToggle, etc. if not modified, or include them if necessary for context.
// Since I am replacing the block containing HeaderContainer to NavLink, I must include all styled components in that range or accept that I'm only modifying the top part.
// The user instruction says "Rename HeaderContainer...", "Create new HeaderContent...", "Update Logo...", "Update JSX".
// I will provide the FULL replacement for the styled components section to be safe, and then the JSX update.

// WAIT, I should split this into two edits if the ranges are far apart or complex.
// The styled components are at the top (lines ~12-80). The JSX is further down (lines ~150-200).
// I will maximize the tool usage.

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.fontColor};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;

  &:hover {
    transform: rotate(15deg);
    color: ${(props) => props.theme.linkColor};
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${(props) => props.theme.fontColor};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: ${(props) => props.theme.body};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
`;

const MobileNavLink = styled(NavLink)`
  font-size: 1.5rem;
`;

const MobileDivider = styled.div`
  width: 60px;
  height: 2px;
  background-color: ${(props) => props.theme.fontColor};
  opacity: 0.2;
  margin: 0.5rem 0;
`;

const FooterContainer = styled.footer`
  width: 100%;
  padding: 3rem 0;
  border-top: 1px solid ${(props) => props.theme.fontColor}1a;
  margin-top: auto;
  background: ${(props) => props.theme.body};
  position: relative;
  z-index: 10;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 0 2rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const SocialIconLink = styled.a`
  color: ${(props) => props.theme.fontColor};
  font-size: 1.8rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: ${(props) => props.theme.linkColor};
    transform: translateY(-3px);
  }
`;

const Copyright = styled.p`
  font-size: 0.9rem;
  color: ${(props) => props.theme.fontColor};
  opacity: 0.6;
  text-align: center;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.5px;

  a {
    color: ${(props) => props.theme.fontColor};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${(props) => props.theme.linkColor};
    }
  }
`;

const DropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.fontColor};
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.linkColor + "20"};
    color: ${(props) => props.theme.linkColor};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: ${(props) => props.theme.body};
  border: 1px solid ${(props) => props.theme.fontColor}1a;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 220px;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  transform: translateY(${(props) => (props.isOpen ? "0" : "-10px")});
  transition: all 0.2s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const DropdownItem = styled.a`
  display: block;
  padding: 0.75rem 1rem;
  color: ${(props) => props.theme.fontColor};
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  cursor: pointer;
  margin-top: 0 !important;
  text-align: left;

  &:hover {
    background-color: ${(props) => props.theme.linkColor + "10"};
    color: ${(props) => props.theme.linkColor};
    text-decoration: none;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.fontColor}1a;
  margin: 0.5rem 0;
`;

export default function PageLayout(props) {
  const currentYear = new Date().getFullYear();
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const [blogEnabled, setBlogEnabled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    getBlogEnabled().then((result) => {
      if (result.exists()) {
        setBlogEnabled(result.data().blogEnabled);
      } else {
        console.log("No such document!");
      }
    });
  }, []);

  function getResume(e) {
    if (e) e.preventDefault();
    getResumeService().then((result) => {
      if (result.exists()) {
        downloadBase64PDF(result.data().base64);
      } else {
        console.log("No such document!");
      }
    });
    setIsMobileMenuOpen(false);
  }

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
    window.open(url, "_blank");
  }

  async function handleLogout(e) {
    if (e) e.preventDefault();
    try {
      await logout();
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch {
      setError("There was a problem logging out");
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isAdmin = currentUser && currentUser.email === "jpbates13@gmail.com";

  const publicItems = [
    { label: "Home", href: "/", show: true },
    { label: "Projects", href: "/projects", show: true },
    { label: "Resume", onClick: getResume, show: true },
    { label: "Blog", href: "/blog", show: blogEnabled },
  ];

  const adminItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      show: isAdmin,
    },
    {
      label: "Create Post",
      href: "/create-post",
      show: isAdmin,
    },
    {
      label: "Drafts",
      href: "/drafts",
      show: isAdmin,
    },
  ];

  const userItems = [
    {
      label: "Office Attendance",
      href: "/office-attendance",
      show: !!currentUser,
    },
    { label: "Log Out", onClick: handleLogout, show: !!currentUser },
  ];

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <CookieConsent>
        This website uses cookies to improve user experience and analyze website
        traffic.
      </CookieConsent>

      <HeaderWrapper>
        <HeaderContent>
          <Logo href="/">Jake Bates</Logo>

          <NavContainer>
            {publicItems.map(
              (item, index) =>
                item.show && (
                  <NavLink key={index} href={item.href} onClick={item.onClick}>
                    {item.label}
                  </NavLink>
                ),
            )}

            {currentUser && (
              <DropdownContainer ref={dropdownRef}>
                <DropdownButton
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FaUserCircle size={20} />
                  {isAdmin ? "Admin" : "Account"}
                  <FaCaretDown />
                </DropdownButton>
                <DropdownMenu isOpen={isDropdownOpen}>
                  {adminItems.map(
                    (item, index) =>
                      item.show && (
                        <DropdownItem
                          key={`admin-${index}`}
                          href={item.href}
                          onClick={(e) => {
                            if (item.onClick) item.onClick(e);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {item.label}
                        </DropdownItem>
                      ),
                  )}
                  {isAdmin && <Divider />}
                  {userItems.map(
                    (item, index) =>
                      item.show && (
                        <DropdownItem
                          key={`user-${index}`}
                          href={item.href}
                          onClick={(e) => {
                            if (item.onClick) item.onClick(e);
                            setIsDropdownOpen(false);
                          }}
                        >
                          {item.label}
                        </DropdownItem>
                      ),
                  )}
                </DropdownMenu>
              </DropdownContainer>
            )}
            <ThemeToggle onClick={props.themeToggler}>
              {props.theme === "light" ? <FaSun /> : <FaMoon />}
            </ThemeToggle>
          </NavContainer>

          <MobileMenuToggle onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuToggle>

          <MobileMenuOverlay isOpen={isMobileMenuOpen}>
            {publicItems.map(
              (item, index) =>
                item.show && (
                  <MobileNavLink
                    key={index}
                    href={item.href}
                    onClick={(e) => {
                      if (item.onClick) item.onClick(e);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </MobileNavLink>
                ),
            )}
            {currentUser && <MobileDivider />}
            {adminItems.map(
              (item, index) =>
                item.show && (
                  <MobileNavLink
                    key={`admin-${index}`}
                    href={item.href}
                    onClick={(e) => {
                      if (item.onClick) item.onClick(e);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </MobileNavLink>
                ),
            )}
            {userItems.map(
              (item, index) =>
                item.show && (
                  <MobileNavLink
                    key={`user-${index}`}
                    href={item.href}
                    onClick={(e) => {
                      if (item.onClick) item.onClick(e);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.label}
                  </MobileNavLink>
                ),
            )}
            <ThemeToggle
              onClick={props.themeToggler}
              style={{ fontSize: "1.5rem" }}
            >
              {props.theme === "light" ? <FaSun /> : <FaMoon />}
            </ThemeToggle>
          </MobileMenuOverlay>
        </HeaderContent>
      </HeaderWrapper>

      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div className="current-content" style={{ flex: 1 }}>
        {props.children}
      </div>

      <FooterContainer>
        <FooterContent>
          <SocialLinks>
            <SocialIconLink
              href="https://www.linkedin.com/in/joshua-jake-bates/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </SocialIconLink>
            <SocialIconLink
              href="https://github.com/jpbates13"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </SocialIconLink>
          </SocialLinks>
          <Copyright>
            &copy; {currentYear} <a href="/">Jake Bates</a>. All rights
            reserved. Icons by{" "}
            <a target="_blank" href="https://icons8.com" rel="noreferrer">
              Icons8
            </a>
          </Copyright>
        </FooterContent>
      </FooterContainer>
    </div>
  );
}
