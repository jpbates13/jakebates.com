import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import {
  FaArrowAltCircleRight,
  FaArrowAltCircleLeft,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import "../styles/Slider.scss";

const projects = [
  {
    title: "JakeBates.com",
    date: "January 2022",
    description:
      "A constantly maintained personal website that serves as a directory of my resume, personal projects, as well as other relevant documents. Previously this website has used WordPress but now it is hosted via Github Pages with a custom layout I created, using Jekyll as a templating engine.",
    repository: "https://github.com/jpbates13/jakebates.com",
  },
  {
    title: "Trustee Campaign Wesbite",
    date: "February 2021",
    description:
      "A website I created for my campaign to be UMass Boston's 2021-22 Student Trustee. I spent a lot of time getting the very unqiue design just right and I was very happy with the way it turned out.",
    repository: "https://github.com/jpbates13/trustee-campaign-website",
  },
  {
    title: "Apartment Travel Predictions",
    date: "September 2020",
    description:
      "This is a python/flask app I use to see when busses are arriving near my apartment using the MBTA API. I run it on a raspberry pi, making it accessible to everyone on my apartment's network so that my roommates can also see when busses are arriving.",
    repository: "https://github.com/jpbates13/apartment-travel-predictions",
  },
  {
    title: "uBored",
    date: "January 2020",
    description:
      "I was one of fifteen UMass Boston students selected to participate in Google J-Term, a course in Android app development, at Google's Cambridge offices. My final project was team-built Android app that displayed nearby social events one at a time. The user could swipe right and indicate interest in the event or swipe left to reject it.",
    repository: "https://github.com/jpbates13/ubored",
  },
  {
    title: "Countdown",
    date: "July 2019",
    description:
      "A fancy countdown webpage written in JavaScript and animated and styled using CSS. It counted down the time left until the end of a given workday. I reimplemented this to countdown time until I return to campus during the COVID-19 pandemic.",
    repository: "https://github.com/jpbates13/countdown/",
  },
];

function Projects(props) {
  const [current, setCurrent] = useState(0);
  const [pause, setPause] = useState(false);
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
  }, [pause]);

  if (!Array.isArray(projects) || projects.length <= 0) {
    return null;
  }

  return (
    <div>
      <div className="projects">
        <FaArrowAltCircleLeft className="left-arrow" onClick={prevSlide} />
        <section className="slider">
          {projects.map((slide, index) => {
            return (
              <div
                className={index === current ? "slide active" : "slide"}
                key={index}
              >
                {index === current && (
                  <div>
                    <h1>{slide.title}</h1>
                    <p>
                      <b>{slide.date}</b>
                    </p>
                    <p>{slide.description}</p>
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
        <FaArrowAltCircleRight className="right-arrow" onClick={nextSlide} />
        <br />
      </div>
      <div class="container">
        <div class="row">
          <div
            class="col text-center"
            style={{ cursor: "pointer", marginTop: "25px" }}
            onClick={() => {
              setPause((prevPause) => !prevPause);
            }}
          >
            {pause ? (
              <FaPlay className="play-button" />
            ) : (
              <FaPause className="pause-button" />
            )}
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row">
          <div class="col text-center">
            <Button
              style={{ marginTop: "40px" }}
              size="lg"
              href="https://www.github.com/jpbates13"
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
