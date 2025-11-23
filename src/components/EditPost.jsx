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
import { Form, Button } from "react-bootstrap";
import { Timestamp } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
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
    let promise;
    //get the post from firebase using the post in the query string
    if (serachParam.get("draft") == "true") {
      promise = getDraft(serachParam.get("post"));
    } else {
      promise = getPost(serachParam.get("post"));
    }
    promise.then((result) => {
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
      const data = {
        body: body,
        tags: tags,
        title: title,
        category: category,
        date: Timestamp.now(),
        updatedDate: null,
      };

      const titleId = idify(title);
      await createPost(titleId, data).catch((err) => {
        setError(err);
      });

      await deleteDraft(post.id);
    } else {
      await updatePost(post.id, {
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
      await updateDraft(post.id, {
        body: body,
        tags: tags,
        title: title,
        category: category,
        updatedDate: Timestamp.now(),
      }).catch((err) => {
        setError(err);
      });
    } else {
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
            await deleteDraft(post.id);
            navigate("/drafts");
          } else {
            await deletePost(post.id);
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
