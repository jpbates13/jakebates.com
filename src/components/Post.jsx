import React, { useEffect, useState } from "react";
import { getPost } from "../services/firestoreService";
import { useSearchParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet";
import PostDisplay from "./PostDisplay";

export default function Post(props) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParam] = useSearchParams();
  const postId = searchParam.get("post");

  useEffect(() => {
    if (postId) {
      setLoading(true);
      getPost(postId).then((result) => {
        if (result.exists()) {
          setPost(result.data());
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      });
    }
  }, [postId]);

  return (
    <div>
      {post && (
        <Helmet>
          <title>{post.title} | JakeBates.com</title>
          <meta property="og:title" content={post.title} />
          <meta
            property="og:description"
            content={post.summary || "A blog post by Jake Bates"}
          />
          <meta
            property="og:image"
            content={post.imageUrl || "https://jakebates.com/logo512.png"}
          />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="description"
            content={post.summary || "A blog post by Jake Bates"}
          />
        </Helmet>
      )}
      <PostDisplay
        post={post}
        loading={loading}
        backTo="/blog"
        backText="Back to Blog"
      />
    </div>
  );
}
