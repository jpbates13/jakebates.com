import React, { useRef, useState, useEffect } from "react";
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
import { Form, Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

function EditPost(props) {
  const { user } = useSelector((state) => state.auth);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const titleRef = useRef();
  const tagRef = useRef();

  const [post, setPost] = useState({ title: "Loading...", id: "initial" });
  const [isDraft, setIsDraft] = useState(false);
  const [serachParam] = useSearchParams();

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
    content: post.body,
  });

  useEffect(() => {
    if (serachParam.get("postId")) {
      setIsDraft(false);
      axios
        .get("/api/posts/" + serachParam.get("postId"))
        .then((res) => setPost(res.data));
    } else if (serachParam.get("draftId")) {
      setIsDraft(true);
      const token = user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      axios
        .get("/api/drafts/" + serachParam.get("draftId"), config)
        .then((res) => setPost(res.data));
    }
  }, [serachParam, user.token, editor.commands]);

  useEffect(() => {
    if (post.body) {
      editor.commands.setContent(post.body);
    }
  }, [post, editor.commands]);

  async function submitPost(title, body, tags) {
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (isDraft) {
      await axios.delete("/api/drafts/" + post._id, config);
      await axios.post("/api/posts/", { title, body }, config);
    } else {
      await axios.put("/api/posts/" + post._id, { title, body }, config);
    }
  }
  async function submitDraft(title, body, tags) {
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (!isDraft) {
      await axios.delete("/api/posts/" + post._id, config);
      await axios.post("/api/drafts/", { title, body }, config);
    } else {
      await axios.put("/api/drafts/" + post._id, { title, body }, config);
    }
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
      setLoading(false);
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
    } catch {
      setError("Failed to submit draft");
    }

    setLoading(false);
  }

  return (
    <div>
      <Helmet>
        <title>JakeBates.com | Editing {post.title}</title>
      </Helmet>
      <h2>Edit Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Form.Control
        value={post.title}
        ref={titleRef}
        type="text"
        onChange={(e) => {
          setPost((prevState) => ({
            ...prevState,
            title: e.target.value,
          }));
        }}
      />
      <br />
      <Form.Control
        placeholder="Enter some tags..."
        defaultValue={post.tags}
        ref={tagRef}
        type="text"
      />
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

export default EditPost;
