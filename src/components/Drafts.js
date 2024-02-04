import React, { useState, useEffect } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
import db from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { Helmet } from "react-helmet";
function Drafts() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoriesPopulated, setCategoriesPopulated] = useState(false);
  const [postsEmpty, setPostsEmpty] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    onSnapshot(collection(db, "drafts"), (snapshot) => {
      setPosts(
        // we sort it so the most recent posts are on top
        snapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .sort((a, b) => {
            return b.date.toDate() - a.date.toDate();
          })
      );

      if (snapshot.docs.length === 0) {
        setPostsEmpty(true);
      }

      setIsLoading(false);
    });
    // check query string for category
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      window.history.pushState(
        {},
        "",
        window.location.pathname + "?category=" + selectedCategory
      );
    } else {
      window.history.pushState({}, "", window.location.pathname);
    }
  }, [selectedCategory]);

  useEffect(() => {
    let newCategories = [];
    let categoryPopulatedLocal = false;
    if (posts.length === 0) {
      return;
    }
    posts.forEach((post) => {
      if (post.category && !newCategories.includes(post.category)) {
        console.log(post);
        newCategories = [...newCategories, post.category];
        categoryPopulatedLocal = true;
      } else if (
        (!post.category || post.category === "") &&
        !newCategories.includes("Uncategorized")
      ) {
        newCategories = [...newCategories, "Uncategorized"];
        categoryPopulatedLocal = true;
      }
    });
    setCategories(
      newCategories,
      setCategoriesPopulated(categoryPopulatedLocal)
    );
  }, [posts]);

  useEffect(() => {
    if (
      categoriesPopulated &&
      categories.length > 0 &&
      selectedCategory &&
      !categories.includes(selectedCategory)
    ) {
      setSelectedCategory(null);
    } else if (postsEmpty) {
      setSelectedCategory(null);
    }
  }, [categoriesPopulated, postsEmpty]);

  return (
    <div>
      {!selectedCategory && (
        <h2
          style={{
            textDecoration: "none",
            fontSize: "40px",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Categories
        </h2>
      )}
      {selectedCategory && (
        <>
          <Link
            onClick={() => {
              setSelectedCategory(null);
            }}
          >
            back
          </Link>
          <h2
            style={{
              textDecoration: "none",
              fontSize: "40px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {selectedCategory}
          </h2>
        </>
      )}
      <hr />

      <div className="all-posts">
        <Helmet>
          <title>JakeBates.com | Drafts</title>
        </Helmet>

        {!selectedCategory &&
          categories.map((category) => (
            <div
              className="post-content"
              key={category}
              onClick={() => {
                setSelectedCategory(category);
              }}
            >
              {isLoading ? (
                <h2> {category}</h2>
              ) : (
                <Link className="post-block">
                  <Link
                    style={{
                      textDecoration: "none",
                      fontSize: "36px",
                      textAlign: "center",
                      verticalAlign: "middle",
                    }}
                    className="blogTitleLink"
                  >
                    {category}
                  </Link>
                </Link>
              )}
            </div>
          ))}
        {selectedCategory &&
          posts.map(
            (post) =>
              (post.category === selectedCategory ||
                (selectedCategory === "Uncategorized" && !post.category)) && (
                <div className="post-content" key={post.id}>
                  {isLoading ? (
                    <h2>{post.title}</h2>
                  ) : (
                    <Link
                      className="post-block"
                      state={{ post: post }}
                      to={"/preview?postId=" + post.id}
                    >
                      <Link
                        style={{
                          textDecoration: "none",
                          fontSize: "36px",
                        }}
                        state={{ post: post }}
                        className="blogTitleLink"
                        to={"/preview?postId=" + post.id}
                      >
                        {post.title}
                      </Link>
                      <p style={{ fontSize: "small" }}>
                        <b>{post.date?.toDate().toDateString()}</b>
                      </p>
                      <br />
                      {currentUser && (
                        <Link
                          state={{ post: post }}
                          to={"/edit?postId=" + post.id + "&draft=true"}
                        >
                          Edit
                        </Link>
                      )}
                    </Link>
                  )}
                </div>
              )
          )}
      </div>
    </div>
  );
}

export default Drafts;
