import React from "react";
import { useState, useEffect } from "react";
import { getBlogEnabled, updateBlogEnabled } from "../services/firestoreService";

function Settings() {
  //get the blog-enabled document from the content collection
  const [blogEnabled, setBlogEnabled] = useState(false);
  useEffect(() => {
    getBlogEnabled().then((result) => {
      if (result.exists()) {
        setBlogEnabled(result.data().blogEnabled);
      } else {
        console.log("No such document!");
      }
    });
  }, []);

  function handleBlogEnabledChange() {
    updateBlogEnabled(!blogEnabled).catch((err) => {
      console.log(err);
    });
    setBlogEnabled(!blogEnabled);
  }

  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>
      <div style={{ marginRight: "10px" }}>Enable Blog: </div>
      <div>
        <input
          type="checkbox"
          checked={blogEnabled}
          onChange={handleBlogEnabledChange}
        ></input>
      </div>
    </div>
  );
}

export default Settings;
