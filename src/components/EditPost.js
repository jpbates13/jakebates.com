import React, { useRef, useState, useEffect } from "react";
import Editor from "./editor/Editor";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useNavigate } from "react-router";
import db from "../firebase";
import { onSnapshot, collection, addDoc } from "firebase/firestore";
import { Form, Button } from "react-bootstrap";
import { doc, updateDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";

function EditPost(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const titleRef = useRef();
  const tagRef = useRef();

  const location = useLocation();
  const post = location.state.post;
  const docuemntRef = doc(db, "posts", post.id);

  let editor = useEditor({
    extensions: [StarterKit],
    content: post.body,
  });

  async function submitPost(title, body, tags) {
    await updateDoc(docuemntRef, {
      body: body,
      tags: tags,
      title: title,
    }).catch((err) => {
      console.log(err);
    });
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

  return (
    <div>
      <h2>Edit Post</h2>
      <Form.Control defaultValue={post.title} ref={titleRef} type="text" />
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
      </Button>
    </div>
  );
}

export default EditPost;
