import React from "react";
import styled from "styled-components";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem;
  min-height: 80vh;
`;
const BackLink = styled(Link)`
  color: ${(props) => props.theme.fontColor};
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 2rem;
  align-self: center;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.7;
  transition: all 0.2s;
  background: ${(props) => props.theme.body + "cc"};
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  border: 1px solid ${(props) => props.theme.fontColor}1a;
  backdrop-filter: blur(12px);

  &:hover {
    opacity: 1;
    transform: translateY(-2px);
    color: ${(props) => props.theme.linkColor};
    text-decoration: none;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const PostCard = styled(motion.article)`
  background: ${(props) => props.theme.body + "cc"};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${(props) => props.theme.fontColor}1a;
  border-radius: 24px;
  padding: 3rem 4rem;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
  border-bottom: 1px solid ${(props) => props.theme.fontColor}1a;
  padding-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: ${(props) => props.theme.titleColor};
  margin-bottom: 1rem;
  font-family: "Computer Modern Serif", serif;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MetaInfo = styled.div`
  color: ${(props) => props.theme.fontColor};
  opacity: 0.7;
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Content = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${(props) => props.theme.fontColor};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${(props) => props.theme.titleColor};
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  p {
    margin-bottom: 1.5rem;
  }

  a {
    color: ${(props) => props.theme.linkColor};
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;

    &:hover {
      border-bottom-color: ${(props) => props.theme.linkColor};
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 2rem 0;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  }

  blockquote {
    border-left: 4px solid ${(props) => props.theme.linkColor};
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    opacity: 0.8;
  }

  code {
    background: ${(props) => props.theme.fontColor}1a;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
  }

  pre {
    background: ${(props) =>
      props.theme.body === "#fff" ? "#f5f5f5" : "#1e1e1e"};
    padding: 1.5rem;
    border-radius: 12px;
    overflow-x: auto;
    margin: 2rem 0;

    code {
      background: none;
      padding: 0;
      color: inherit;
    }
  }

  ul,
  ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

export default function PostDisplay({ post, loading, backTo, backText }) {
  if (loading) {
    // You could allow a skeletal loader here if desired
    return (
      <Container>
        <PostCard>
          <Header>
            <Title>Loading...</Title>
          </Header>
        </PostCard>
      </Container>
    );
  }

  if (!post) return null;

  return (
    <Container>
      {backTo && <BackLink to={backTo}>&larr; {backText || "Back"}</BackLink>}
      <PostCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>{post.title}</Title>
          <MetaInfo>
            <span>{post.date?.toDate().toDateString()}</span>
            {post.updatedDate && (
              <i>Updated: {post.updatedDate?.toDate().toDateString()}</i>
            )}
          </MetaInfo>
        </Header>
        <Content
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }}
        />
      </PostCard>
    </Container>
  );
}
