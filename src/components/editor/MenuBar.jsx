import React from "react";
import styled from "styled-components";
import {
  FaBold,
  FaItalic,
  FaStrikethrough,
  FaCode,
  FaParagraph,
  FaHeading,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaUndo,
  FaRedo,
  FaImage,
  FaLink,
  FaUnlink,
  FaMinus,
  FaEraser,
  FaCodeBranch,
} from "react-icons/fa";

const MenuBarContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${(props) => props.theme.body + "cc"};
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${(props) => props.theme.fontColor}1a;
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 12px 12px 0 0;
`;

const MenuButton = styled.button`
  background: ${(props) =>
    props.isActive ? props.theme.linkColor : "transparent"};
  color: ${(props) => (props.isActive ? "#fff" : props.theme.fontColor)};
  border: 1px solid
    ${(props) =>
      props.isActive ? props.theme.linkColor : props.theme.fontColor + "33"};
  border-radius: 6px;
  padding: 0.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  min-width: 32px;
  height: 32px;

  &:hover {
    background: ${(props) =>
      props.isActive ? props.theme.linkColor : props.theme.fontColor + "1a"};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
      background: transparent;
    }
  }
`;

const Divider = styled.div`
  width: 1px;
  background: ${(props) => props.theme.fontColor}33;
  margin: 0 0.5rem;
  height: 24px;
  align-self: center;
`;

export default function MenuBar({ editor }) {
  if (!editor) {
    return null;
  }

  function addImage() {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }

  function setLink() {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <MenuBarContainer>
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        title="Bold"
      >
        <FaBold />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        title="Italic"
      >
        <FaItalic />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        title="Strikethrough"
      >
        <FaStrikethrough />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        title="Inline Code"
      >
        <FaCode />
      </MenuButton>

      <Divider />

      <MenuButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive("paragraph")}
        title="Paragraph"
      >
        <FaParagraph />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        title="Heading 1"
      >
        H1
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        title="Heading 2"
      >
        H2
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        title="Heading 3"
      >
        H3
      </MenuButton>

      <Divider />

      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <FaListUl />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        title="Ordered List"
      >
        <FaListOl />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive("codeBlock")}
        title="Code Block"
      >
        <FaCodeBranch />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        title="Blockquote"
      >
        <FaQuoteRight />
      </MenuButton>

      <Divider />

      <MenuButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <FaMinus />
      </MenuButton>
      <MenuButton onClick={addImage} title="Add Image">
        <FaImage />
      </MenuButton>
      <MenuButton
        onClick={setLink}
        isActive={editor.isActive("link")}
        title="Set Link"
      >
        <FaLink />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().unsetLink().run()}
        disabled={!editor.isActive("link")}
        title="Unlink"
      >
        <FaUnlink />
      </MenuButton>

      <Divider />

      <MenuButton
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        title="Clear Marks"
      >
        <FaEraser />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo"
      >
        <FaUndo />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo"
      >
        <FaRedo />
      </MenuButton>
    </MenuBarContainer>
  );
}
