import React from "react";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import db from "../firebase";

function Settings() {
  //get the blog-enabled document from the content collection
  const [blogEnabled, setBlogEnabled] = useState(false);
  useEffect(() => {
    const docRef = doc(db, "content", "blogEnabled");
    getDoc(docRef).then((result) => {
      if (result.exists()) {
        setBlogEnabled(result.data().blogEnabled);
      } else {
        console.log("No such document!");
      }
    });
  }, []);

  function handleBlogEnabledChange() {
    const docRef = doc(db, "content", "blogEnabled");
    updateDoc(docRef, {
      blogEnabled: !blogEnabled,
    }).catch((err) => {
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
