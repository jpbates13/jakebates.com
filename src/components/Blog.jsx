import React, { useState, useEffect } from "react";
import { subscribeToPosts } from "../services/firestoreService";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { motion } from "framer-motion";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 80vh;
`;

const BlogHeader = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${(props) => props.theme.titleColor};
  margin-bottom: 2rem;
  text-align: center;
  font-family: "Computer Modern Serif", serif;
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
`;

const BlogCard = styled(motion.div)`
  background: ${(props) => props.theme.body + "cc"};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid ${(props) => props.theme.fontColor}1a;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 200px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border-color: ${(props) => props.theme.linkColor};
  }
`;

const CardTitle = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => props.theme.titleColor};
  text-decoration: none;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.linkColor};
    text-decoration: none;
  }
`;

const CardDate = styled.p`
  font-size: 0.85rem;
  color: ${(props) => props.theme.fontColor};
  opacity: 0.7;
  margin: 0;
`;

const BackLink = styled(Link)`
  color: ${(props) => props.theme.fontColor};
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 1rem;
  align-self: flex-start;
  display: inline-block;
  opacity: 0.7;
  transition: all 0.2s;

  &:hover {
    opacity: 1;
    transform: translateX(-5px);
    color: ${(props) => props.theme.linkColor};
    text-decoration: none;
  }
`;

function Blog() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoriesPopulated, setCategoriesPopulated] = useState(false);
  const [postsEmpty, setPostsEmpty] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = subscribeToPosts((snapshot) => {
      setPosts(
        // we sort it so the most recent posts are on top
        snapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .sort((a, b) => {
            return b.date.toDate() - a.date.toDate();
          }),
      );
      if (snapshot.docs.length === 0) {
        setPostsEmpty(true);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();

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
        window.location.pathname + "?category=" + selectedCategory,
      );
    } else {
      window.history.pushState({}, "", window.location.pathname);
    }
  }, [selectedCategory]);

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

  useEffect(() => {
    let newCategories = [];
    let categoryPopulatedLocal = false;
    if (posts.length === 0) {
      return;
    }
    posts.forEach((post) => {
      if (post.category && !newCategories.includes(post.category)) {
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
    setCategories(newCategories);
    setCategoriesPopulated(categoryPopulatedLocal);
  }, [posts]);

  return (
    <PageContainer>
      <Helmet>
        <title>JakeBates.com | Blog</title>
      </Helmet>

      {selectedCategory && (
        <BackLink
          to="#"
          onClick={(e) => {
            e.preventDefault();
            setSelectedCategory(null);
          }}
        >
          &larr; Back to Categories
        </BackLink>
      )}

      <BlogHeader>
        {selectedCategory ? selectedCategory : "Categories"}
      </BlogHeader>

      <BlogGrid>
        {!selectedCategory &&
          categories.map((category) => (
            <BlogCard
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CardTitle as="div" style={{ marginBottom: 0 }}>
                {category}
              </CardTitle>
            </BlogCard>
          ))}

        {selectedCategory &&
          posts.map(
            (post) =>
              (post.category === selectedCategory ||
                (selectedCategory === "Uncategorized" && !post.category)) && (
                <BlogCard
                  key={post.id}
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CardTitle to={"/post?post=" + post.id}>
                    {post.title}
                  </CardTitle>
                  <CardDate>{post.date?.toDate().toDateString()}</CardDate>
                  {currentUser && (
                    <Link
                      style={{ marginTop: "1rem", fontSize: "0.8rem" }}
                      state={{ post: post }}
                      to={"/edit?post=" + post.id + "&draft=false"}
                    >
                      Edit
                    </Link>
                  )}
                </BlogCard>
              ),
          )}
      </BlogGrid>
    </PageContainer>
  );
}

export default Blog;
