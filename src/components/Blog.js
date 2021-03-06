import React, { useState, useEffect } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
import db from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Helmet } from "react-helmet";
function Blog() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([{ title: "Loading...", id: "initial" }]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(collection(db, "posts"), (snapshot) => {
      setPosts(
        // we sort it so the most recent posts are on top
        snapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .sort((a, b) => {
            return b.date.toDate() - a.date.toDate();
          })
      );
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="all-posts">
      <Helmet>
        <title>JakeBates.com | Blog</title>
      </Helmet>
      {posts.map((post) => (
        <div className="post-content" key={post.id}>
          {isLoading ? (
            <h2>{post.title}</h2>
          ) : (
            <a className="post-block" href={"/post?postId=" + post.id}>
              <Link
                style={{
                  textDecoration: "none",
                  fontSize: "36px",
                  fontWeight: "bold",
                }}
                className="blogTitleLink"
                to={"/post?postId=" + post.id}
              >
                {post.title}
              </Link>
              <p style={{ fontSize: "small" }}>
                <b>{post.date?.toDate().toDateString()}</b>
              </p>
              <br />
              {currentUser && (
                <Link state={{ post: post }} to={"/edit?postId=" + post.id}>
                  Edit
                </Link>
              )}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

export default Blog;
