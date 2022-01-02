import React, { useRef, useState } from "react";
import Editor from "./editor/Editor";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useNavigate } from "react-router";
import db from "../firebase";
import { onSnapshot, collection, addDoc } from "firebase/firestore";
import { Form, Button } from "react-bootstrap";

function CreatePost(props) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  const titleRef = useRef();
  const tagRef = useRef();

  async function submitPost(title, body, tags) {
    const data = {
      body: body,
      tags: tags,
      title: title,
    };
    const collectionRef = collection(db, "posts");
    const docRef = await addDoc(collectionRef, data);
    console.log("The new ID is: " + docRef.id);
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
      <h2>Create a New Post</h2>
      <Form.Control placeholder="Enter a title..." ref={titleRef} type="text" />
      <br />
      <Form.Control placeholder="Enter some tags..." ref={tagRef} type="text" />
      <br />
      <Editor editor={editor} />
      <br />
      <Button disabled={loading} onClick={handlePost}>
        Post
      </Button>
    </div>
  );
}

export default CreatePost;
