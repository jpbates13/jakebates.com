import React from "react";
import { EditorContent } from "@tiptap/react";
import "../../styles/EditorStyles.scss";
import MenuBar from "./MenuBar";

export default function Editor({ editor }) {
  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
