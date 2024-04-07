import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { IconContext } from "react-icons";
import { FaArrowRight, FaArrowLeft, FaPlay, FaPause } from "react-icons/fa";
import "../../styles/Slider.scss";
import { Helmet } from "react-helmet";
// import projects from "./ProjectData";
import { Tooltip } from "@mui/material";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import db from "../../firebase";
import TechStack from "./TechStack";

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
    const collectionRef = collection(db, "projects");
    const q = query(collectionRef, orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectData = [];
      querySnapshot.forEach((doc) => {
        projectData.push(doc.data());
      });
      //sort projects by date
      projectData.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      setProjects(projectData);
      setProjectType("professional");
      setCurrentProjects(
        projectData.filter((project) => project.type === "professional")
      );
      setLength(
        projectData.filter((project) => project.type === "professional").length
      );
      setCurrent(0)
    });
    return () => unsubscribe();
  }, []);

  const [showOptions, setShowOptions] = useState(false);
  const handleProjectTypeClick = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div>
      <Helmet>
        <title>JakeBates.com | Projects</title>
      </Helmet>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 onClick={handleProjectTypeClick}>
          You are currently viewing{" "}
          <u style={{ cursor: "pointer" }}>{projectType}</u> projects.
        </h2>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {showOptions && (
          <div className={`options ${showOptions ? "slide-out" : "slide-up"}`}>
            <p
              style={{ cursor: "pointer" }}
              onClick={() => {
                setProjectType("all");
                setCurrentProjects(projects);
                setLength(projects.length);
                setShowOptions(false);
                setCurrent(0)
              }}
            >
              all
            </p>
            <p
              style={{ cursor: "pointer" }}
              onClick={() => {
                setProjectType("personal");
                setCurrentProjects(
                  projects.filter((project) => project.type === "personal")
                );
                setLength(
                  projects.filter((project) => project.type === "personal")
                    .length
                );
                setShowOptions(false);
                setCurrent(0)
              }}
            >
              personal
            </p>
            <p
              style={{ cursor: "pointer" }}
              onClick={() => {
                setProjectType("professional");
                setCurrentProjects(
                  projects.filter((project) => project.type === "professional")
                );
                setLength(
                  projects.filter((project) => project.type === "professional")
                    .length
                );
                setShowOptions(false);
                setCurrent(0)
              }}
            >
              professional
            </p>
          </div>
        )}
      </div>
      <div className="projects">
        <section className="slider">
          {currentProjects.map((slide, index) => {
            return (
              <div
                className={index === current ? "slide active" : "slide"}
                key={index}
              >
                {index === current && (
                  <div>
                    <div onClick={nextSlide}>
                      <div class="project-title">
                        <h1>{slide.title}</h1>
                        <TechStack techStack={slide.tech_stack} />
                      </div>
                      <p>
                        <b>{slide.date}</b>
                      </p>
                      <p>{slide.description}</p>
                    </div>
                    {slide.repository == "not_public" ? (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        href={"#"}
                        disabled={true}
                      >
                        Repository not public
                      </Button>
                    ) : (
                      <Button
                        variant="outline-primary"
                        size="sm"
                        href={slide.repository}
                      >
                        See Repository
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        <br />
      </div>
      <div class="container">
        <div class="sliderControls">
          <IconContext.Provider
            value={{ color: props.theme === "light" ? "black" : "#EEEEEE" }}
          >
            <Tooltip title="Previous slide">
              <div>
                <FaArrowLeft className="left-arrow" onClick={prevSlide} />
              </div>
            </Tooltip>
          </IconContext.Provider>
          <div
            class="col text-center"
            style={{ cursor: "pointer", marginTop: "25px" }}
            onClick={() => {
              setPause((prevPause) => !prevPause);
            }}
          >
            {pause ? (
              <Tooltip title="Start autoscrolling">
                <div>
                  <FaPlay className="play-button" />
                </div>
              </Tooltip>
            ) : (
              <Tooltip title="Stop autoscrolling">
                <div>
                  <FaPause className="pause-button" />
                </div>
              </Tooltip>
            )}
          </div>
          <IconContext.Provider
            value={{ color: props.theme === "light" ? "black" : "#EEEEEE" }}
          >
            <Tooltip title="Next slide">
              <div>
                <FaArrowRight className="right-arrow" onClick={nextSlide} />
              </div>
            </Tooltip>
          </IconContext.Provider>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="col text-center">
            <Button
              style={{ marginTop: "40px" }}
              size="lg"
              href="https://www.github.com/jpbates13"
              className="github-button"
            >
              See Github Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Projects;
