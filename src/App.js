import Header from "./Header";
import Nav from "./Nav";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import About from "./About";
import Missing from "./Missing";
import Footer from "./Footer";

import { Route, Routes, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "./api/posts";
import { EditPost } from "./EditPost";
import useWindowResize from "./hooks/useWindowResize";
function App() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState();
  const [postBody, setPostBody] = useState();
  const [editTitle, setEditTitle] = useState();
  const [editBody, setEditBody] = useState();
  const navigate = useNavigate();
  const { width } = useWindowResize();
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.header);
        } else {
          console.log(`Error:${err.message}`);
        }
      }
    };
    fetchPost();
  }, []);
  const handleEdit = async (id) => {
    const date = format(new Date(), "MMM dd, yyyy pp");
    const updatedPost = {
      id: id,
      title: editTitle,
      dateTime: date,
      body: editBody,
    };
    const response = await api.put(`posts/${id}`, updatedPost);
    setPosts(
      posts.map((post) => (post.id === id ? { ...response.data } : post))
    );
    setEditTitle(" ");
    setEditBody(" ");
    navigate("/");
  };
  const handleChange = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const date = format(new Date(), "MMM dd, yyyy pp");
    const res = { id: id, title: postTitle, dateTime: date, body: postBody };
    try {
      const response = await api.post("/posts", res);
      const allPost = [...posts, response.data];
      setPosts(allPost);
      setPostTitle(" ");
      setPostBody(" ");
      navigate("/");
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.header);
      } else {
        console.log(`Error:${err.message}`);
      }
    }
  };
  useEffect(() => {
    const filterPostResults = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.body.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filterPostResults.reverse());
  }, [posts, search]);
  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      const newData = posts.filter((post) => post.id !== id);
      setPosts(newData);
      navigate("/");
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.header);
      } else {
        console.log(`Error:${err.message}`);
      }
    }
  };

  return (
    <div className="App">
      <Header title="Social Media" width={width} />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home posts={searchResults} />} />
        <Route path="/about" element={<About />} />
        <Route path="/post">
          <Route
            index
            element={
              <NewPost
                postTitle={postTitle}
                setPostTitle={setPostTitle}
                postBody={postBody}
                setPostBody={setPostBody}
                handleChange={handleChange}
              />
            }
          />
          <Route
            path=":id"
            element={<PostPage posts={posts} handleDelete={handleDelete} />}
          />
        </Route>
        <Route
          path="/edit/:id"
          element={
            <EditPost
              posts={posts}
              handleEdit={handleEdit}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editBody={editBody}
              setEditBody={setEditBody}
            />
          }
        />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
