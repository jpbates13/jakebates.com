import React, { useState, useEffect } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
import db from "../firebase";
import DOMPurify from "dompurify";

function Blog() {
  const [posts, setPosts] = useState([{ title: "Loading...", id: "initial" }]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(collection(db, "posts"), (snapshot) => {
      setPosts(
        // we reverse it so its in reverse chronological roder
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })).reverse()
      );
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} style={{ paddingBottom: "50px" }}>
          {isLoading ? (
            <h2>{post.title}</h2>
          ) : (
            <Link to={"/post?postId=" + post.id}>
              <h2>{post.title}</h2>
            </Link>
          )}
          <div
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }}
          />
        </div>
      ))}
    </div>
  );
}

export default Blog;
