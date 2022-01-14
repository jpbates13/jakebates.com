import React, { useRef, useState } from "react";
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
import db from "../firebase";
import { Form, Button } from "react-bootstrap";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";

function EditPost(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const titleRef = useRef();
  const tagRef = useRef();

  const location = useLocation();
  const post = location.state.post;

  let editor = useEditor({
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

  async function submitPost(title, body, tags) {
    if (post.isDraft) {
      const collectionRef = collection(db, "posts");
      const draftDocRef = doc(db, "drafts", post.id);
      await addDoc(collectionRef, {
        body: body,
        tags: tags,
        title: title,
        date: Timestamp.now(),
        updatedDate: null,
      }).catch((err) => {
        setError(err);
      });
      await deleteDoc(draftDocRef);
    } else {
      const documentRef = doc(db, "posts", post.id);
      await updateDoc(documentRef, {
        body: body,
        tags: tags,
        title: title,
        updatedDate: Timestamp.now(),
      }).catch((err) => {
        setError(err);
      });
    }
  }
  async function submitDraft(title, body, tags) {
    if (post.isDraft) {
      const documentRef = doc(db, "drafts", post.id);
      await updateDoc(documentRef, {
        body: body,
        tags: tags,
        title: title,
        updatedDate: Timestamp.now(),
      }).catch((err) => {
        setError(err);
      });
    } else {
      const collectionRef = collection(db, "drafts");
      const postDocRef = doc(db, "posts", post.id);
      await addDoc(collectionRef, {
        body: body,
        tags: tags,
        title: title,
        isDraft: true,
        date: Timestamp.now(),
        updatedDate: null,
      }).catch((err) => {
        setError(err);
      });
      await deleteDoc(postDocRef);
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
      <h2>Edit Post</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
