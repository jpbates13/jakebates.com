import React, { useEffect, useState } from "react";
import { getPost } from "../services/firestoreService";
import { useSearchParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet";

export default function Post(props) {
  const [post, setPost] = useState({ title: "Loading...", id: "initial" });
  const [serachParam] = useSearchParams();
  serachParam.get("post");

  useEffect(() => {
    getPost(serachParam.get("post")).then((result) => {
      if (result.exists()) {
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
        <title>{post.title} | JakeBates.com</title>
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
