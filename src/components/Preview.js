import React, { useEffect, useState } from "react";
import { getDraft } from "../services/firestoreService";
import { useSearchParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet";

export default function Preview(props) {
  const [post, setPost] = useState({ title: "Loading...", id: "initial" });
  const [serachParam] = useSearchParams();
  serachParam.get("post");

  useEffect(() => {
    getDraft(serachParam.get("post")).then((result) => {
      if (result.exists()) {
        console.log("Document data:", result.data());
        setPost(result.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });
  }, [serachParam]);

  return (
    <div>
      <Helmet>
        <title>Previewing {post.title} | JakeBates.com</title>
      </Helmet>
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
