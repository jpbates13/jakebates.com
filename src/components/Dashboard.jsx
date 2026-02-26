import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getBio, updateBio } from "../services/firestoreService";
import EditProjects from "./EditProjects";
import ResumeUpload from "./ResumeUpload";
import Settings from "./Settings";
import {
  FaUser,
  FaProjectDiagram,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSave,
} from "react-icons/fa";

const DashboardContainer = styled.div`
  display: flex;
  min-height: 80vh;
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.fontColor};
  font-family: "Inter", sans-serif;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
  margin-top: 2rem;
  border: 1px solid ${(props) => props.theme.fontColor}1a;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 260px;
  background: ${(props) => props.theme.secondaryBackground || "#f8f9fa"};
  border-right: 1px solid ${(props) => props.theme.fontColor}1a;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid ${(props) => props.theme.fontColor}1a;
    padding: 1rem;
    flex-direction: row;
    overflow-x: auto;
    gap: 1rem;
    align-items: center;

    /* Hide scrollbar for cleaner look */
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const SidebarHeader = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  padding-left: 1rem;
  color: ${(props) => props.theme.fontColor};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    margin-bottom: 0;
    min-width: max-content;
  }
`;

const NavItem = styled.button`
  background: ${(props) =>
    props.$active ? props.theme.linkColor || "#007bff" : "transparent"};
  color: ${(props) => (props.$active ? "#fff" : props.theme.fontColor)};
  border: none;
  border-radius: 12px;
  padding: 0.8rem 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  width: 100%;

  &:hover {
    background: ${(props) =>
      props.$active ? props.theme.linkColor : props.theme.fontColor + "1a"};
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    width: auto;
    white-space: nowrap;
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 3rem;
  overflow-y: auto;
  max-height: 80vh;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const ContentHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: ${(props) => props.theme.titleColor || props.theme.fontColor};
`;

const Subtitle = styled.p`
  color: ${(props) => props.theme.fontColor}99;
  margin-top: 0.5rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid ${(props) => props.theme.fontColor}1a;
  background: ${(props) => props.theme.body};
  color: ${(props) => props.theme.fontColor};
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.linkColor || "#007bff"};
  }
`;

const ActionButton = styled.button`
  background: ${(props) => props.theme.linkColor || "#007bff"};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const AlertMessage = styled.div`
  padding: 1rem;
  border-radius: 8px;
  background: #fee2e2;
  color: #ef4444;
  margin-bottom: 1rem;
  border: 1px solid #fca5a5;
`;

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [activeTab, setActiveTab] = useState("bio");

  useEffect(() => {
    getBio().then((result) => {
      if (result.exists()) {
        setBio(result.data().content);
      } else {
        console.log("No such document!");
      }
    });
  }, []);

  async function submitBio() {
    try {
      setError("");
      await updateBio(bio);
      // Maybe add a success toast here in the future
      alert("Bio updated successfully!");
    } catch (err) {
      setError("Failed to update bio");
      console.error(err);
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      setError("Failed to log out");
    }
  };

  const navItems = [
    { id: "bio", label: "Bio", icon: <FaUser /> },
    { id: "projects", label: "Projects", icon: <FaProjectDiagram /> },
    { id: "resume", label: "Resume", icon: <FaFileAlt /> },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "bio":
        return (
          <>
            <ContentHeader>
              <Title>Edit Biography</Title>
              <Subtitle>
                Update the main bio displayed on your homepage
              </Subtitle>
            </ContentHeader>
            {error && <AlertMessage>{error}</AlertMessage>}
            <TextArea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={12}
              placeholder="Write your bio here..."
            />
            <ActionButton onClick={submitBio}>
              <FaSave /> Save Bio
            </ActionButton>
          </>
        );
      case "projects":
        return (
          <>
            <ContentHeader>
              <Title>Manage Projects</Title>
              <Subtitle>
                Add, edit, or remove projects from your portfolio
              </Subtitle>
            </ContentHeader>
            <EditProjects />
          </>
        );
      case "resume":
        return (
          <>
            <ContentHeader>
              <Title>Resume Upload</Title>
              <Subtitle>Upload a new version of your resume</Subtitle>
            </ContentHeader>
            <ResumeUpload />
          </>
        );
      case "settings":
        return (
          <>
            <ContentHeader>
              <Title>Settings</Title>
              <Subtitle>Configure global application settings</Subtitle>
            </ContentHeader>
            <Settings />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>Dashboard</SidebarHeader>
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            $active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            {item.label}
          </NavItem>
        ))}

        <div style={{ marginTop: "auto" }}>
          <NavItem onClick={handleLogout} style={{ color: "#ef4444" }}>
            <FaSignOutAlt />
            Log Out
          </NavItem>
        </div>
      </Sidebar>
      <ContentArea>{renderContent()}</ContentArea>
    </DashboardContainer>
  );
}
