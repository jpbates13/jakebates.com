import React, { useEffect, useRef, useState } from "react";
import Editor from "./editor/Editor";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import Link from "@tiptap/extension-link";
import { useNavigate } from "react-router";
import {
  getPost,
  getDraft,
  createPost,
  createDraft,
  updatePost,
  updateDraft,
  deletePost,
  deleteDraft,
} from "../services/firestoreService";
import { Timestamp } from "firebase/firestore";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import {
  FaSave,
  FaPaperPlane,
  FaTrash,
  FaSpinner,
  FaImage,
  FaTag,
  FaFolder,
  FaAlignLeft,
  FaSlidersH,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${(props) => props.theme.titleColor};
  margin: 0;
  font-family: "Computer Modern Serif", serif;
`;

const Section = styled(motion.div)`
  margin-bottom: 2rem;
  background: ${(props) => props.theme.body + "66"};
  border: 1px solid ${(props) => props.theme.fontColor}1a;
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(12px);
  overflow: hidden;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${(props) => props.theme.fontColor}cc;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StyledInput = styled.input`
  width: 100%;
  background: ${(props) => props.theme.body + "cc"};
  border: 1px solid ${(props) => props.theme.fontColor}33;
  color: ${(props) => props.theme.fontColor};
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.linkColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.linkColor}33;
    background: ${(props) => props.theme.body};
  }

  &::placeholder {
    color: ${(props) => props.theme.fontColor}66;
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  background: ${(props) => props.theme.body + "cc"};
  border: 1px solid ${(props) => props.theme.fontColor}33;
  color: ${(props) => props.theme.fontColor};
  padding: 0.8rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.linkColor};
    box-shadow: 0 0 0 3px ${(props) => props.theme.linkColor}33;
    background: ${(props) => props.theme.body};
  }

  &::placeholder {
    color: ${(props) => props.theme.fontColor}66;
  }
`;

const TitleInput = styled(StyledInput)`
  font-size: 1.8rem;
  font-weight: 700;
  padding: 1rem;
  border: none;
  background: transparent;
  border-bottom: 2px solid ${(props) => props.theme.fontColor}1a;
  border-radius: 0;
  margin-bottom: 2rem;

  &:focus {
    box-shadow: none;
    border-color: ${(props) => props.theme.linkColor};
    background: transparent;
  }
`;

const ActionButton = styled.button`
  background: ${(props) =>
    props.variant === "primary"
      ? props.theme.linkColor
      : props.variant === "danger"
        ? "#ff4d4f"
        : "transparent"};
  color: ${(props) =>
    props.variant === "primary" || props.variant === "danger"
      ? "#fff"
      : props.theme.fontColor};
  border: 1px solid
    ${(props) =>
      props.variant === "outline"
        ? props.theme.fontColor + "33"
        : "transparent"};
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background: ${(props) =>
      props.variant === "outline" ? props.theme.fontColor + "1a" : ""};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const HeaderButton = styled.button`
  background: transparent;
  color: ${(props) => props.theme.fontColor};
  border: 1px solid ${(props) => props.theme.fontColor}33;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-left: 1rem;
  opacity: 0.7;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    background: ${(props) => props.theme.fontColor}1a;
  }

  ${(props) =>
    props.active &&
    `
    background: ${props.theme.linkColor}1a;
    border-color: ${props.theme.linkColor};
    color: ${props.theme.linkColor};
    opacity: 1;
  `}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  justify-content: flex-end;
  border-top: 1px solid ${(props) => props.theme.fontColor}1a;
  padding-top: 2rem;
`;

const ErrorMessage = styled.div`
  background: #ff4d4f22;
  color: #ff4d4f;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid #ff4d4f44;
`;

const StatusIndicator = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: ${(props) => props.theme.body};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  border: 1px solid ${(props) => props.theme.fontColor}1a;
  z-index: 100;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: translateY(${(props) => (props.visible ? 0 : "10px")});
  transition: all 0.3s ease;
`;

function EditPost(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState(null); // 'saving', 'saved', 'error'

  const navigate = useNavigate();

  const titleRef = useRef();
  const tagRef = useRef();
  const categoryRef = useRef();
  const imageUrlRef = useRef();
  const summaryRef = useRef();

  const [post, setPost] = useState({});

  const [searchParam] = useSearchParams();
  const postId = searchParam.get("post");
  const isDraftParam = searchParam.get("draft") === "true";

  const [confirmDelete, setConfirmDelete] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(10);
  const secondsLeftRef = useRef(secondsLeft);
  secondsLeftRef.current = secondsLeft;

  // reset the confirm delete state after 10 seconds
  useEffect(() => {
    if (!confirmDelete) return;
    const timeout = setTimeout(() => {
      setConfirmDelete(false);
      setSecondsLeft(10);
    }, 10000);
    const secondsLeftInterval = setInterval(() => {
      setSecondsLeft(secondsLeftRef.current - 1);
    }, 1000);
    return () => {
      clearTimeout(timeout);
      clearInterval(secondsLeftInterval);
    };
  }, [confirmDelete]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Document,
      Paragraph,
      Text,
      Image,
      Dropcursor,
      Link,
    ],
    content: "",
  });

  useEffect(() => {
    if (!postId) {
      setPost({});
      setShowMetadata(true); // Always show metadata for new posts
      if (editor) {
        editor.commands.setContent("");
      }
      if (titleRef.current) titleRef.current.value = "";
      if (tagRef.current) tagRef.current.value = "";
      if (categoryRef.current) categoryRef.current.value = "";
      if (imageUrlRef.current) imageUrlRef.current.value = "";
      if (summaryRef.current) summaryRef.current.value = "";
      return;
    }

    let promise;
    //get the post from firebase using the post in the query string
    if (isDraftParam) {
      promise = getDraft(postId);
    } else {
      promise = getPost(postId);
    }
    promise.then((result) => {
      if (result.exists()) {
        setPost({ ...result.data(), id: result.id });
        if (editor) {
          editor.commands.setContent(result.data().body);
        }
        if (titleRef.current)
          titleRef.current.value = result.data().title || "";
        if (tagRef.current) tagRef.current.value = result.data().tags || "";
        if (categoryRef.current)
          categoryRef.current.value = result.data().category || "";
        if (imageUrlRef.current)
          imageUrlRef.current.value = result.data().imageUrl || "";
        if (summaryRef.current)
          summaryRef.current.value = result.data().summary || "";
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
  }, [postId, isDraftParam, editor]);

  // Autosave Effect
  useEffect(() => {
    // Only autosave if it's already a draft (to avoid accidentally creating drafts for every new post or updating live posts)
    if (!post.id || !post.isDraft) return;

    const interval = setInterval(async () => {
      try {
        setAutoSaveStatus("saving");
        await saveDraftInternal();
        setAutoSaveStatus("saved");
        setTimeout(() => setAutoSaveStatus(null), 3000); // Hide after 3s
      } catch (err) {
        console.error("Autosave failed", err);
        setAutoSaveStatus("error");
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [post, editor]); // Dependencies: post ID and draft status

  function idify(title) {
    if (!title) return "";
    return title.replace(/\s+/g, "-").toLowerCase();
  }

  function getFormData() {
    return {
      title: titleRef.current?.value || "",
      body: editor?.getHTML() || "",
      tags: tagRef.current?.value || "",
      category: categoryRef.current?.value || "",
      imageUrl: imageUrlRef.current?.value || "",
      summary: summaryRef.current?.value || "",
    };
  }

  async function saveDraftInternal() {
    const formData = getFormData();
    if (!formData.title) return; // Don't autosave untitled

    const data = {
      ...formData,
      isDraft: true,
      date: Timestamp.now(),
      updatedDate: null,
    };

    if (!post.id) {
      // Create New Draft logic (should rarely be hit by autosave unless we enable "autosave new")
      // For now, saveDraftInternal matches submitDraft logic but returns the promise
      const titleId = idify(formData.title);
      await createDraft(titleId, data);
      setPost((prev) => ({ ...prev, id: titleId, isDraft: true })); // Update local state
    } else if (post.isDraft) {
      // Update existing draft
      await updateDraft(post.id, {
        ...formData,
        updatedDate: Timestamp.now(),
      });
    } else {
      // It is a published post being converted to draft - Autosave shouldn't do this silently
      throw new Error(
        "Cannot autosave published post as draft without explicit action",
      );
    }
  }

  async function submitPost() {
    const formData = getFormData();
    const data = {
      ...formData,
      date: Timestamp.now(),
      updatedDate: null,
    };

    if (!post.id) {
      // Create New
      const titleId = idify(formData.title);
      await createPost(titleId, data).catch((err) => {
        setError(err);
      });
    } else if (post.isDraft) {
      // Publish Draft
      const titleId = idify(formData.title);
      await createPost(titleId, data).catch((err) => {
        setError(err);
      });
      await deleteDraft(post.id);
    } else {
      // Update Post
      await updatePost(post.id, {
        ...formData,
        updatedDate: Timestamp.now(),
      }).catch((err) => {
        setError(err);
      });
    }
  }

  async function submitDraft() {
    const formData = getFormData();
    const data = {
      ...formData,
      isDraft: true,
      date: Timestamp.now(),
      updatedDate: null,
    };

    if (!post.id) {
      // Create New Draft
      const titleId = idify(formData.title);
      await createDraft(titleId, data).catch((err) => {
        setError(err);
      });
    } else if (post.isDraft) {
      // Update Draft
      await updateDraft(post.id, {
        ...formData,
        updatedDate: Timestamp.now(),
      }).catch((err) => {
        setError(err);
      });
    } else {
      // Unpublish Post (Convert to Draft)
      const titleId = idify(formData.title);
      await createDraft(titleId, data).catch((err) => {
        setError(err);
      });
      await deletePost(post.id);
    }
  }

  async function handlePost(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await submitPost();
      navigate("/blog");
    } catch {
      setError("Failed to submit post");
    }

    setLoading(false);
  }

  async function handleDraft(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await submitDraft();
      navigate("/drafts");
    } catch {
      setError("Failed to submit draft");
    }

    setLoading(false);
  }

  return (
    <Container>
      <Helmet>
        <title>
          JakeBates.com | {post.id ? "Editing" : "Creating"}{" "}
          {post.title ? post.title : "Post"}
        </title>
      </Helmet>

      <StatusIndicator visible={!!autoSaveStatus}>
        {autoSaveStatus === "saving" && (
          <>
            <FaSpinner className="spin" /> Autosaving...
          </>
        )}
        {autoSaveStatus === "saved" && (
          <>
            <FaCheckCircle style={{ color: "#52c41a" }} /> Saved
          </>
        )}
        {autoSaveStatus === "error" && <>Error saving</>}
      </StatusIndicator>

      <Header>
        <LogoArea>
          <Title>{post.id ? "Edit Post" : "Create Post"}</Title>
          <HeaderButton
            active={showMetadata}
            onClick={() => setShowMetadata(!showMetadata)}
          >
            <FaSlidersH /> Settings
          </HeaderButton>
        </LogoArea>
        {post.id && (
          <ActionButton
            variant="danger"
            disabled={loading}
            style={{
              backgroundColor: confirmDelete
                ? `rgba(255, 77, 79, ${secondsLeftRef.current / 10})`
                : "",
            }}
            onClick={async () => {
              if (!confirmDelete) {
                setConfirmDelete(true);
                return;
              }
              if (post.isDraft) {
                await deleteDraft(post.id);
                navigate("/drafts");
              } else {
                await deletePost(post.id);
                navigate("/blog");
              }
            }}
          >
            {confirmDelete ? (
              `Confirm (${secondsLeftRef.current})`
            ) : (
              <>
                <FaTrash /> Delete
              </>
            )}
          </ActionButton>
        )}
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <TitleInput
        defaultValue={post.title}
        ref={titleRef}
        type="text"
        placeholder="Enter your post title here..."
      />

      <AnimatePresence>
        {showMetadata && (
          <Section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Grid>
              <InputGroup>
                <Label>
                  <FaFolder /> Category
                </Label>
                <StyledInput
                  placeholder="e.g. Technology"
                  defaultValue={post.category}
                  ref={categoryRef}
                  type="text"
                />
              </InputGroup>
              <InputGroup>
                <Label>
                  <FaTag /> Tags
                </Label>
                <StyledInput
                  placeholder="e.g. react, firebase (comma separated)"
                  defaultValue={post.tags}
                  ref={tagRef}
                  type="text"
                />
              </InputGroup>
            </Grid>
            <Grid>
              <InputGroup>
                <Label>
                  <FaImage /> Cover Image URL
                </Label>
                <StyledInput
                  placeholder="https://example.com/image.jpg"
                  defaultValue={post.imageUrl}
                  ref={imageUrlRef}
                  type="text"
                />
              </InputGroup>
              <InputGroup>
                <Label>
                  <FaAlignLeft /> Summary
                </Label>
                <StyledTextArea
                  placeholder="Write a brief summary for SEO and previews..."
                  defaultValue={post.summary}
                  ref={summaryRef}
                />
              </InputGroup>
            </Grid>
          </Section>
        )}
      </AnimatePresence>

      <Editor editor={editor} />

      <ButtonGroup>
        <ActionButton
          variant="outline"
          disabled={loading}
          onClick={handleDraft}
        >
          <FaSave /> Save Draft
        </ActionButton>
        <ActionButton variant="primary" disabled={loading} onClick={handlePost}>
          {loading ? <FaSpinner className="spin" /> : <FaPaperPlane />} Post
        </ActionButton>
      </ButtonGroup>
    </Container>
  );
}

export default EditPost;
