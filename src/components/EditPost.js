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
import db from "../firebase";
import { Form, Button } from "react-bootstrap";
import {
  doc,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { getDoc, setDoc } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";

function EditPost(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const titleRef = useRef();
  const tagRef = useRef();
  const categoryRef = useRef();

  const [post, setPost] = useState({});

  const [serachParam] = useSearchParams();

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
    let docRef;
    //get the post from firebase using the post in the query string
    if (serachParam.get("draft") == "true") {
      docRef = doc(db, "drafts", serachParam.get("post"));
    } else {
      docRef = doc(db, "posts", serachParam.get("post"));
    }
    getDoc(docRef).then((result) => {
      if (result.exists()) {
        setPost({ ...result.data(), id: result.id });
        if (editor) {
          editor.commands.setContent(result.data().body);
        }
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
  }, [serachParam, editor]);

  function idify(title) {
    return title.replace(/\s+/g, "-").toLowerCase();
  }

  async function submitPost(title, body, tags, category) {
    if (post.isDraft) {
      const draftDocRef = doc(db, "drafts", post.id);

      const data = {
        body: body,
        tags: tags,
        title: title,
        category: category,
        date: Timestamp.now(),
        updatedDate: null,
      };

      const titleId = idify(title);
      const docRef = doc(db, "posts", titleId);
      await setDoc(docRef, data).catch((err) => {
        setError(err);
      });

      await deleteDoc(draftDocRef);
    } else {
      const documentRef = doc(db, "posts", post.id);
      await updateDoc(documentRef, {
        body: body,
        tags: tags,
        title: title,
        category: category,
        updatedDate: Timestamp.now(),
      }).catch((err) => {
        setError(err);
      });
    }
  }
  async function submitDraft(title, body, tags, category) {
    if (post.isDraft) {
      const documentRef = doc(db, "drafts", post.id);
      await updateDoc(documentRef, {
        body: body,
        tags: tags,
        title: title,
        category: category,
        updatedDate: Timestamp.now(),
      }).catch((err) => {
        setError(err);
      });
    } else {
      const postDocRef = doc(db, "posts", post.id);
      const data = {
        body: body,
        tags: tags,
        title: title,
        category: category,
        isDraft: true,
        date: Timestamp.now(),
        updatedDate: null,
      };

      const titleId = idify(title);
      const docRef = doc(db, "drafts", titleId);
      await setDoc(docRef, data).catch((err) => {
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
        tagRef.current.value,
        categoryRef.current.value
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
        tagRef.current.value,
        categoryRef.current.value
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
        <title>JakeBates.com | Editing {post.title ? post.title : ""}</title>
      </Helmet>
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
      <Form.Control
        placeholder="Enter a category"
        defaultValue={post.category}
        ref={categoryRef}
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
      </Button>{" "}
      <Button
        disabled={loading}
        style={{
          backgroundColor: `rgba(255, 0, 0, ${secondsLeftRef.current / 10})`,
        }}
        onClick={async () => {
          // delete the post from firebase
          if (!confirmDelete) {
            setConfirmDelete(true);
            return;
          }
          if (post.isDraft) {
            let draftDocRef = doc(db, "drafts", post.id);
            await deleteDoc(draftDocRef);
            navigate("/drafts");
          } else {
            let postDocRef = doc(db, "posts", post.id);
            await deleteDoc(postDocRef);
            navigate("/blog");
          }
        }}
      >
        {confirmDelete ? "Click again to confirm deletion..." : "Delete Post"}
        {confirmDelete && secondsLeftRef.current}
      </Button>
    </div>
  );
}

export default EditPost;
