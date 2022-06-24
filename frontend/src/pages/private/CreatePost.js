import React, { useRef, useState } from "react";
import Editor from "../../components/editor/Editor";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import Link from "@tiptap/extension-link";
import { useNavigate } from "react-router";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { Form, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import axios from "axios";
function CreatePost(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();

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

  const titleRef = useRef();
  const tagRef = useRef();

  async function submitPost(title, body, tags) {
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.post("/api/posts/", { title, body }, config);
  }

  async function submitDraft(title, body, tags) {
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.post("/api/drafts/", { title, body }, config);
  }

  async function handlePost(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await submitPost(
        titleRef.current.value,
        editor.getHTML(),
        tagRef.current.value
      );
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
      await submitDraft(
        titleRef.current.value,
        editor.getHTML(),
        tagRef.current.value
      );
      navigate("/drafts");
    } catch (err) {
      setError("Failed to submit drfaft");
      console.log(err);
    }

    setLoading(false);
  }

  return (
    <div>
      <Helmet>
        <title>JakeBates.com</title>
      </Helmet>
      <h2>Create a New Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Form.Control placeholder="Enter a title..." ref={titleRef} type="text" />
      <br />
      <Form.Control placeholder="Enter some tags..." ref={tagRef} type="text" />
      <br />
      <Editor editor={editor} />
      <br />
      <Button disabled={loading} onClick={handlePost}>
        Post
      </Button>{" "}
      <Button
        variant="outline-primary"
        disabled={loading}
        onClick={handleDraft}
      >
        Save Draft
      </Button>
    </div>
  );
}

export default CreatePost;
