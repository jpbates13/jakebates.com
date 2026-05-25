import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { FaHeartBroken, FaBriefcase } from "react-icons/fa";
import { Helmet } from "react-helmet";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.fontColor};
  text-align: center;
  font-family: "Inter", sans-serif;
`;

const ContentBox = styled(motion.div)`
  max-width: 600px;
  background: ${(props) => props.theme.secondaryBackground || "transparent"};
  padding: 3rem 2rem;
  border-radius: 24px;
  border: 1px solid ${(props) => props.theme.fontColor}22;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const IconWrapper = styled(motion.div)`
  font-size: 4rem;
  color: #ef4444;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.titleColor};
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const Highlight = styled.span`
  color: #ef4444;
  font-weight: bold;
`;

const ActionButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: ${(props) => props.theme.linkColor};
  color: ${(props) => props.theme.buttonFontColor || "#fff"};
  padding: 12px 24px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    color: ${(props) => props.theme.buttonFontColor || "#fff"};
    text-decoration: none;
  }
`;

export default function OutOfMoney() {
  return (
    <Container>
      <Helmet>
        <title>Jake is Broke</title>
      </Helmet>
      <ContentBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <IconWrapper
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <FaHeartBroken />
        </IconWrapper>
        <Title>Jake is Broke.</Title>
        <Subtitle>
          You've successfully reached my portfolio, but unfortunately I just hit
          my <Highlight>daily cloud budget</Highlight>. The site's automated
          "kill switch" has activated to prevent my credit card from
          spontaneously combusting.
          <br />
          <br />
          Please hire me so I can afford to keep this site running 24/7. Come
          back tomorrow when the free tier resets!
        </Subtitle>
        <ActionButton
          href="https://linkedin.com/in/jake-bates"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaBriefcase /> Recruit Jake on LinkedIn
        </ActionButton>
      </ContentBox>
    </Container>
  );
}
