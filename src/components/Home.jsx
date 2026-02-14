import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaGithub, FaFileDownload } from "react-icons/fa";
import { Helmet } from "react-helmet";
import Headshot from "../images/headshot.png";
import {
  getResume as getResumeService,
  getBio,
} from "../services/firestoreService";

import { Tooltip } from "@mui/material";

const BlinkingCursor = styled.span`
  display: inline-block;
  width: 2px;
  height: 1em;
  background-color: ${(props) => props.theme.titleColor};
  margin-left: 2px;
  animation: ${(props) =>
    props.$visible ? "blink 1s step-end infinite" : "none"};
  opacity: ${(props) => (props.$visible ? 1 : 0)};
  transition: opacity 1s ease-out;
  vertical-align: middle;
  position: relative;
  top: -0.1em;

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
`;

const HomeContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  max-width: 1200px;
  width: 100%;

  @media (min-width: 992px) {
    flex-direction: row;
    align-items: center; // Center vertically
    justify-content: space-between;
    text-align: left;
  }
`;

const ImageSection = styled(motion.div)`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    border: 4px solid ${(props) => props.theme.linkColor};
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    @media (min-width: 768px) {
      width: 350px;
      height: 350px;
    }
    @media (min-width: 992px) {
      width: 400px;
      height: 400px;
    }
  }
`;

const TextSection = styled(motion.div)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;

  @media (min-width: 992px) {
    align-items: flex-start;
    text-align: left;
    padding-left: 2rem;
  }
`;

const Greeting = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${(props) => props.theme.titleColor};
  margin: 0;

  span {
    color: ${(props) => props.theme.linkColor};
  }

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const BioText = styled(motion.div)`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${(props) => props.theme.fontColor};
  margin: 0;
  max-width: 600px;
  overflow: hidden;
`;

const LinkGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  @media (min-width: 992px) {
    justify-content: flex-start;
  }
`;

const StyledButton = styled(motion.a)`
  background: transparent;
  border: 2px solid ${(props) => props.theme.linkColor};
  color: ${(props) => props.theme.fontColor};
  padding: 0 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  min-width: 160px;
  height: 50px;
  margin: 0 !important;

  &:hover {
    background: ${(props) => props.theme.linkColor};
    color: ${(props) => props.theme.buttonFontColor || "#fff"};
    text-decoration: none;
  }
`;

export default function Home() {
  const [bio, setBio] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [typedName, setTypedName] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const runAnimation = async () => {
      const startDelay = 1200; // Wait for entrance animations
      const typeDelay = 100;
      const backspaceDelay = 100;
      const pauseDelay = 1500;
      const cursorFadeDelay = 2500;

      // Initial Delay
      await new Promise((r) => setTimeout(r, startDelay));
      if (!isMounted) return;

      const type = async (text) => {
        for (let i = 0; i <= text.length; i++) {
          if (!isMounted) return;
          setTypedName(text.substring(0, i));
          await new Promise((r) => setTimeout(r, typeDelay));
        }
      };

      const backspace = async (current) => {
        for (let i = current.length; i >= 0; i--) {
          if (!isMounted) return;
          setTypedName(current.substring(0, i));
          await new Promise((r) => setTimeout(r, backspaceDelay));
        }
      };

      // 1. Type Joshua
      await type("Joshua");
      if (!isMounted) return;

      // 2. Wait
      await new Promise((r) => setTimeout(r, pauseDelay));
      if (!isMounted) return;

      // 3. Backspace Joshua
      await backspace("Joshua");
      if (!isMounted) return;

      // 4. Type Jake
      await type("Jake");
      if (!isMounted) return;

      // 5. Wait then fade cursor
      await new Promise((r) => setTimeout(r, cursorFadeDelay));
      if (!isMounted) return;
      setShowCursor(false);
    };

    runAnimation();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    getBio().then((result) => {
      if (result.exists()) {
        setBio(result.data().content);
      } else {
        console.log("No such document!");
      }
    });
  }, []);

  function getResume(e) {
    e.preventDefault();
    getResumeService().then((result) => {
      if (result.exists()) {
        downloadBase64PDF(result.data().base64);
      } else {
        console.log("No such document!");
      }
    });
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

  const ReadMoreButton = styled.span`
    color: ${(props) => props.theme.linkColor};
    font-weight: bold;
    cursor: pointer;
    margin-left: 5px;

    &:hover {
      text-decoration: underline;
    }
  `;

  return (
    <HomeContainer>
      <Helmet>
        <title>JakeBates.com | Home</title>
      </Helmet>

      <ContentWrapper>
        <ImageSection
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={Headshot} alt="Jake Bates Headshot" />
        </ImageSection>

        <TextSection
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Greeting>
            Hello! I'm{" "}
            <Tooltip
              title="Legally Joshua, colloquially Jake"
              arrow
              placement="top"
            >
              <span style={{ cursor: "help", borderBottom: "1px dotted" }}>
                {typedName}
              </span>
            </Tooltip>
            <BlinkingCursor $visible={showCursor} />.
          </Greeting>

          <BioText layout>
            <span
              dangerouslySetInnerHTML={{
                __html: isExpanded
                  ? bio
                  : (() => {
                      // Find first period followed by space outside of tags
                      let inTag = false;
                      for (let i = 0; i < bio.length; i++) {
                        if (bio[i] === "<") inTag = true;
                        if (bio[i] === ">") inTag = false;
                        if (!inTag && bio[i] === "." && bio[i + 1] === " ") {
                          return bio.substring(0, i + 1);
                        }
                      }
                      return bio;
                    })(),
              }}
            />
            {bio && bio !== bio.substring(0, bio.indexOf(". ") + 1) && (
              <ReadMoreButton onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Show less" : "Read more"}
              </ReadMoreButton>
            )}
          </BioText>

          <LinkGroup>
            <StyledButton
              href="#"
              onClick={getResume}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFileDownload /> Resume
            </StyledButton>

            <StyledButton
              href="/projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub /> Projects
            </StyledButton>
          </LinkGroup>
        </TextSection>
      </ContentWrapper>
    </HomeContainer>
  );
}
