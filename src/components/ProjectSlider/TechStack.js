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
    django: django,
    firebase: firebase,
    flask: flask,
    java: java,
    javascript: javascript,
    postgres: postgres,
    python: python,
    react: react,
    springboot: springboot,
    html: html,
    css: css,
    github_pages: github,
    android: android,
    raspberry_pi: raspberry_pi
  };

  const techStack = props.techStack.split(",");

  return (
    <div>
      {techStack.map((tech) => {
        return (
          techStackMapping[tech] && 
          <Tooltip title={tech} arrow>
            <img
              src={techStackMapping[tech.toString().toLowerCase()]}
              style={{ width: "45px", height: "45px" }}
              alt={tech}
            />{" "}
          </Tooltip>

        );
      })}
    </div>
  );
}

export default TechStack;
