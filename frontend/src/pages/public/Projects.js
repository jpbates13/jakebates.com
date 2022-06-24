import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { IconContext } from "react-icons";
import { FaArrowRight, FaArrowLeft, FaPlay, FaPause } from "react-icons/fa";
import "../../styles/Slider.scss";
import { Helmet } from "react-helmet";
import projects from "../../assets/ProjectData";
import { Tooltip } from "@mui/material";

function Projects(props) {
  const [current, setCurrent] = useState(0);
  const [pause, setPause] = useState(true);
  const length = projects.length;

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

  if (!Array.isArray(projects) || projects.length <= 0) {
    return null;
  }

  return (
    <div>
      <Helmet>
        <title>JakeBates.com | Projects</title>
      </Helmet>
      <div className="projects">
        <section className="slider">
          {projects.map((slide, index) => {
            return (
              <div
                className={index === current ? "slide active" : "slide"}
                key={index}
              >
                {index === current && (
                  <div>
                    <div onClick={nextSlide}>
                      <h1>{slide.title}</h1>
                      <p>
                        <b>{slide.date}</b>
                      </p>
                      <p>{slide.description}</p>
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      href={slide.repository}
                    >
                      See Repository
                    </Button>
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
