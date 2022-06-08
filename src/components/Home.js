import React from "react";
import Headshot from "../images/headshot.png";
import Resume from "../assets/resume.pdf";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>JakeBates.com | Home</title>
      </Helmet>
      <div class="row d-flex h-100">
        <div class="headshot col-md-6 justify-content-center">
          <div class="block second">
            <br />
            <img
              style={{ minWidth: "70%", maxWidth: "70%", height: "auto" }}
              class="img-fluid"
              src={Headshot}
              alt="Headshot of Jake"
            />
          </div>
        </div>
        <div class="bio col-md-6 align-middle text-left hidden-sm align-self-auto">
          <div class="block first">
            <p>
              Hello! My name is Jake Bates. I am an incoming Software Engineer
              to Liberty Mutual. I am a graduate of the University of
              Massachusetts Boston with a degree Computer Science and a minor in
              Political Science. I also previously served as Student Trustee on
              the UMass Board of Trustees. I have taken courses in Data
              Structures, Algorithms, Database Management, Software Engineering,
              Artificial Intelligence, Computation Theory, LISP, in addition to
              a variety of math classes and Honors College coursework. I have
              experience in all kinds of software engineering including web and
              mobile app development, both professionally and recreationally.
              You can check out more of my resume <a href={Resume}>here</a> and
              my personal projects{" "}
              <a href="https://github.com/jpbates13">here</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
