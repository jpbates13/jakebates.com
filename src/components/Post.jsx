import React, { useEffect, useState } from "react";
import { getPost, getDraft } from "../services/firestoreService";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import PostDisplay from "./PostDisplay";

export default function Post({ isDraft = false }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParam] = useSearchParams();
  const postId = searchParam.get("post");

  useEffect(() => {
    if (postId) {
      setLoading(true);
      const fetchPost = isDraft ? getDraft : getPost;
      fetchPost(postId).then((result) => {
        if (result.exists()) {
          setPost(result.data());
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      });
    }
  }, [postId, isDraft]);

  return (
    <div>
      {post && (
        <Helmet>
          <title>
            {isDraft ? "Previewing " : ""}
            {post.title} | JakeBates.com
          </title>
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
        backTo={isDraft ? "/drafts" : "/blog"}
        backText={isDraft ? "Back to Drafts" : "Back to Blog"}
      />
    </div>
  );
}
