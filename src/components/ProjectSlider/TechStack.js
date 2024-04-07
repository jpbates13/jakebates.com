import React, { useState } from "react";
import django from "../../images/svg/icons8-django.svg";
import firebase from "../../images/svg/icons8-firebase.svg";
import flask from "../../images/svg/icons8-flask.svg";
import java from "../../images/svg/icons8-java.svg";
import javascript from "../../images/svg/icons8-javascript.svg";
import postgres from "../../images/svg/icons8-postgres.svg";
import python from "../../images/svg/icons8-python.svg";
import react from "../../images/svg/icons8-react.svg";
import springboot from "../../images/svg/icons8-spring-boot.svg";
import html from "../../images/svg/icons8-html.svg";
import css from "../../images/svg/icons8-css.svg";
import github from "../../images/svg/icons8-github-100.svg";
import android from "../../images/svg/icons8-android-studio.svg";
import raspberry_pi from "../../images/svg/icons8-raspberry-pi.svg";

import { Tooltip } from "@mui/material";

function TechStack(props) {
  const techStackMapping = {
    django: [django, "https://www.djangoproject.com/"],
    firebase: [firebase, "https://firebase.google.com/"],
    flask:[flask, "https://flask.palletsprojects.com/en/3.0.x/"],
    java: [java, "https://www.java.com/"],
    javascript: [javascript, "https://developer.mozilla.org/en-US/docs/Web/JavaScript"],
    postgres: [postgres, "https://www.postgresql.org/"],
    python: [python, "https://www.python.org/"],
    react: [react, "https://reactjs.org/"],
    springboot: [springboot, "https://spring.io/projects/spring-boot"],
    html: [html, "https://developer.mozilla.org/en-US/docs/Web/HTML"],
    css: [css, "https://developer.mozilla.org/en-US/docs/Web/CSS"],
    github_pages: [github, "https://pages.github.com/"],
    android: [android, "https://developer.android.com/"],
    raspberry_pi: [raspberry_pi, "https://www.raspberrypi.org/"]
  };

  const techStack = props.techStack.split(",");

  return (
    <div>
      {techStack.map((tech) => {
        return (
          techStackMapping[tech] && 
          <Tooltip title={tech} arrow>
            <a href={techStackMapping[tech.toString().toLowerCase()][1]} target="_blank">
            <img
              src={techStackMapping[tech.toString().toLowerCase()][0]}
              style={{ width: "45px", height: "45px", cursor: "pointer"}}
              alt={tech}
            /></a>{" "}
          </Tooltip>

        );
      })}
    </div>
  );
}

export default TechStack;
