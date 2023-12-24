import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useSelector } from "react-redux";
function Drafts() {
  const [posts, setPosts] = useState([{ title: "Loading...", id: "initial" }]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsLoading(true);
    const token = user.token;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios.get("/api/drafts", config).then((res) => {
      setPosts(res.data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="all-posts">
      <Helmet>
        <title>JakeBates.com | Blog</title>
      </Helmet>
      {posts.map((post) => (
        <div className="post-content" key={post._id}>
          {isLoading ? (
            <h2>{post.title}</h2>
          ) : (
            <a className="post-block" href={"/post?postId=" + post._id}>
              <Link
                style={{
                  textDecoration: "none",
                  fontSize: "36px",
                  fontWeight: "bold",
                }}
                className="blogTitleLink"
                to={"/preview?postId=" + post._id}
              >
                {post.title}
              </Link>
              <p style={{ fontSize: "small" }}>
                <b>{new Date(post.createdAt).toLocaleDateString("en-US")}</b>
              </p>
              <br />
              {user && <Link to={"/edit?draftId=" + post._id}>Edit</Link>}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

export default Drafts;