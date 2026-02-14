import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { IconContext } from "react-icons";
import {
  FaArrowRight,
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaGithub,
} from "react-icons/fa";
import { Helmet } from "react-helmet";
import { Tooltip } from "@mui/material";
import { subscribeToProjects } from "../../services/firestoreService";
import TechStack from "./TechStack";
import styled, { keyframes } from "styled-components";

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 80vh;
  justify-content: center;
`;

const HeaderSection = styled.div`
  margin-bottom: 0.5rem;
  text-align: center;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FilterContainer = styled.div`
  display: inline-flex;
  background: ${(props) => props.theme.body + "80"};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 50px;
  border: 1px solid ${(props) => props.theme.fontColor}1a;
  margin-bottom: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const FilterTab = styled.button`
  background: ${(props) =>
    props.active ? props.theme.linkColor : "transparent"};
  color: ${(props) => (props.active ? "#fff" : props.theme.fontColor)};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:hover {
    background: ${(props) =>
      props.active ? props.theme.linkColor : props.theme.fontColor + "10"};
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ProjectCard = styled.div`
  position: relative;
  background: ${(props) => props.theme.body + "cc"};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${(props) => props.theme.fontColor}1a;
  border-radius: 24px;
  padding: 1.5rem;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 300px;
  justify-content: center;
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ProjectContent = styled.div`
  width: 100%;
  animation: ${fadeIn} 0.5s ease;
`;

// ... (keep props.theme usage in other styled components)

// In the component:
// Replace the map with:
/* 
{currentProjects.length > 0 && currentProjects[current] && (
  <ProjectContent key={current}>
     ...content...
  </ProjectContent>
)}
*/

const ProjectTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.25rem;
  color: ${(props) => props.theme.titleColor};
  font-family: "Computer Modern Serif", serif;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const ProjectDate = styled.p`
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: ${(props) => props.theme.fontColor};
  opacity: 0.7;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ProjectDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: ${(props) => props.theme.fontColor};
  margin-bottom: 1rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto 1rem auto;
  width: 100%;
  padding: 0 1rem;
`;

const ControlButton = styled.button`
  background: ${(props) => props.theme.body};
  border: 1px solid ${(props) => props.theme.fontColor}33;
  color: ${(props) => props.theme.fontColor};
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1.2rem;

  &:hover {
    background: ${(props) => props.theme.fontColor};
    color: ${(props) => props.theme.body};
    border-color: ${(props) => props.theme.fontColor};
    transform: translateY(-2px);
  }
`;

const TechStackWrapper = styled.div`
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: center;
`;

const RepoButton = styled(Button)`
  border-radius: 50px;
  padding: 0.6rem 2rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.85rem;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

function Projects(props) {
  const [current, setCurrent] = useState(0);
  const [pause, setPause] = useState(true);
  const [projects, setProjects] = useState([]);
  const [currentProjects, setCurrentProjects] = useState([]);
  const [length, setLength] = useState(0);
  const [projectType, setProjectType] = useState("all");

  async function nextSlide() {
    await setCurrent(current === length - 1 ? 0 : current + 1);
  }

  async function prevSlide() {
    await setCurrent(current === 0 ? length - 1 : current - 1);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((current) => (current === length - 1 ? 0 : current + 1));
    }, 3500);
    if (pause) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [pause, length]);

  useEffect(() => {
    const unsubscribe = subscribeToProjects((querySnapshot) => {
      const projectData = [];
      querySnapshot.forEach((doc) => {
        projectData.push(doc.data());
      });
      //sort projects by date
      projectData.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setProjects(projectData);
      // Default to professional? Or all? Original code defaulted to professional.
      // Let's stick to professional as default if that's what it was, or maybe 'all' is better.
      // Original code: setProjectType("professional"); setCurrentProjects(...professional...)
      setProjectType("professional");
      const proProjects = projectData.filter(
        (project) => project.type === "professional",
      );
      setCurrentProjects(proProjects);
      setLength(proProjects.length);
      setCurrent(0);
    });
    return () => unsubscribe();
  }, []);

  const handleFilterChange = (type) => {
    setProjectType(type);
    setCurrent(0);
    if (type === "all") {
      setCurrentProjects(projects);
      setLength(projects.length);
    } else {
      const filtered = projects.filter((project) => project.type === type);
      setCurrentProjects(filtered);
      setLength(filtered.length);
    }
  };

  return (
    <PageContainer>
      <Helmet>
        <title>JakeBates.com | Projects</title>
      </Helmet>

      <HeaderSection>
        <FilterContainer>
          <FilterTab
            active={projectType === "all"}
            onClick={() => handleFilterChange("all")}
          >
            All
          </FilterTab>
          <FilterTab
            active={projectType === "professional"}
            onClick={() => handleFilterChange("professional")}
          >
            Professional
          </FilterTab>
          <FilterTab
            active={projectType === "personal"}
            onClick={() => handleFilterChange("personal")}
          >
            Personal
          </FilterTab>
        </FilterContainer>
        <div style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          <RepoButton
            variant="dark"
            size="lg"
            href="https://www.github.com/jpbates13"
            target="_blank"
            style={{ borderRadius: "50px", padding: "0.5rem 1rem" }}
          >
            <FaGithub
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            See Github Profile
          </RepoButton>
        </div>
      </HeaderSection>

      {length > 0 && currentProjects[current] ? (
        <ProjectCard>
          <ProjectContent key={current}>
            <ProjectTitle>{currentProjects[current].title}</ProjectTitle>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              {currentProjects[current].repository === "not_public" ? (
                <RepoButton
                  variant="outline-secondary"
                  disabled={true}
                  style={{
                    marginTop: 0,
                    fontSize: "0.75rem",
                    padding: "0.4rem 1.2rem",
                  }}
                >
                  Repo Private
                </RepoButton>
              ) : (
                <RepoButton
                  variant="outline-primary"
                  href={currentProjects[current].repository}
                  target="_blank"
                  style={{
                    marginTop: 0,
                    fontSize: "0.75rem",
                    padding: "0.4rem 1.2rem",
                  }}
                >
                  View Repo
                </RepoButton>
              )}
            </div>
            <div onClick={nextSlide}>
              <TechStackWrapper>
                <TechStack techStack={currentProjects[current].tech_stack} />
              </TechStackWrapper>
              <ProjectDate>{currentProjects[current].date}</ProjectDate>
              <ProjectDescription>
                {currentProjects[current].description}
              </ProjectDescription>
            </div>
          </ProjectContent>
        </ProjectCard>
      ) : (
        <p>No projects found.</p>
      )}
      {length > 0 && currentProjects[current] && (
        <ControlsContainer>
          <Tooltip title="Previous project">
            <ControlButton onClick={prevSlide}>
              <FaArrowLeft />
            </ControlButton>
          </Tooltip>

          <Tooltip title={pause ? "Start slideshow" : "Pause slideshow"}>
            <ControlButton
              onClick={() => setPause(!pause)}
              style={{ fontSize: "1rem", width: "40px", height: "40px" }}
            >
              {pause ? <FaPlay style={{ marginLeft: "2px" }} /> : <FaPause />}
            </ControlButton>
          </Tooltip>

          <Tooltip title="Next project">
            <ControlButton onClick={nextSlide}>
              <FaArrowRight />
            </ControlButton>
          </Tooltip>
        </ControlsContainer>
      )}

      {/* Spacer or additional content if needed */}
    </PageContainer>
  );
}

export default Projects;
