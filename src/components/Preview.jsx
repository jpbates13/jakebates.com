import React, { useEffect, useState } from "react";
import { getDraft } from "../services/firestoreService";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import PostDisplay from "./PostDisplay";

export default function Preview(props) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParam] = useSearchParams();
  const postId = searchParam.get("post");

  useEffect(() => {
    if (postId) {
      setLoading(true);
      getDraft(postId).then((result) => {
        if (result.exists()) {
          console.log("Document data:", result.data());
          setPost(result.data());
        } else {
          console.log("No such document!");
          setPost({
            title: "Draft Not Found",
            body: "<p>The draft you are looking for does not exist.</p>",
          });
        }
        setLoading(false);
      });
    }
  }, [postId]);

  return (
    <div>
      {post && (
        <Helmet>
          <title>Previewing {post.title} | JakeBates.com</title>
        </Helmet>
      )}
      <PostDisplay post={post} loading={loading} />
    </div>
  );
}
