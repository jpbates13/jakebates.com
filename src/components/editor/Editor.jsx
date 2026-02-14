import React from "react";
import { EditorContent } from "@tiptap/react";
import MenuBar from "./MenuBar";
import styled from "styled-components";

const EditorContainer = styled.div`
  border: 1px solid ${(props) => props.theme.fontColor}33;
  border-radius: 12px;
  background: ${(props) => props.theme.body + "cc"};
  backdrop-filter: blur(12px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;

  &:focus-within {
    box-shadow: 0 0 0 2px ${(props) => props.theme.linkColor}33;
    border-color: ${(props) => props.theme.linkColor};
  }

  .ProseMirror {
    padding: 1.5rem;
    outline: none;
    min-height: 300px;
    font-size: 1.1rem;
    line-height: 1.6;
    color: ${(props) => props.theme.fontColor};

    p {
      margin-bottom: 1em;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 700;
      color: ${(props) => props.theme.titleColor};
    }

    ul,
    ol {
      padding-left: 1.5rem;
      margin-bottom: 1em;
    }

    blockquote {
      border-left: 3px solid ${(props) => props.theme.linkColor};
      padding-left: 1rem;
      margin-left: 0;
      margin-right: 0;
      font-style: italic;
      color: ${(props) => props.theme.fontColor}cc;
    }

    pre {
      background: ${(props) => props.theme.fontColor}1a;
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      font-family: monospace;
    }

    code {
      background: ${(props) => props.theme.fontColor}1a;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
    }

    img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }

    a {
      color: ${(props) => props.theme.linkColor};
      text-decoration: underline;
    }
  }
`;

export default function Editor({ editor }) {
  return (
    <EditorContainer>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </EditorContainer>
  );
}
