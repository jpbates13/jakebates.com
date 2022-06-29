import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet";
import axios from "axios";

export default function Post(props) {
  const [post, setPost] = useState({ title: "Loading...", id: "initial" });
  const [serachParam] = useSearchParams();

  useEffect(() => {
    axios
      .get("/api/posts/" + serachParam.get("postId"))
      .then((res) => setPost(res.data));
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
            <b>{new Date(post.createdAt).toLocaleDateString("en-US")}</b>
          </p>
          {post.updatedAt !== post.createdAt && (
            <p style={{ textAlign: "center", fontSize: "small" }}>
              <i>
                Updated {new Date(post.updatedAt).toLocaleDateString("en-US")}
              </i>
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
