import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import db from "../firebase";
import DOMPurify from "dompurify";

export default function Preview(props) {
  const [post, setPost] = useState({ title: "Loading...", id: "initial" });
  const [serachParam] = useSearchParams();
  serachParam.get("postId");

  useEffect(() => {
    const docRef = doc(db, "drafts", serachParam.get("postId"));
    getDoc(docRef).then((result) => {
      if (result.exists()) {
        console.log("Document data:", result.data());
        setPost(result.data());
        document.title = "JakeBates.com | " + result.data().title;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
  }, [serachParam]);

  return (
    <div>
      <div key={post.id} style={{ paddingBottom: "50px" }}>
        <div style={{ lineHeight: "1%" }}>
          <h2 style={{ textAlign: "center", fontSize: "36px" }}>
            {post.title}
          </h2>
          <p style={{ textAlign: "center", fontSize: "small" }}>
            <b>{post.date?.toDate().toDateString()}</b>
          </p>
          {post.updatedDate && (
            <p style={{ textAlign: "center", fontSize: "small" }}>
              <i>Updated {post.updatedDate?.toDate().toDateString()}</i>
            </p>
          )}
          <hr />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }}
        />
      </div>
    </div>
  );
}
