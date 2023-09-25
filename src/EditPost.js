import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const EditPost = ({
  posts,
  handleEdit,
  editTitle,
  setEditTitle,
  editBody,
  setEditBody,
}) => {
  const { id } = useParams();

  const post = posts.find((post) => post.id.toString() === id);

  useEffect(() => {
    if (post) {
      setEditTitle(post.title);
      setEditBody(post.body);
    }
  }, [post, setEditTitle, setEditBody]);

  return (
    <main className="NewPost">
      <form className="newPostForm" onSubmit={(e) => e.preventDefault()}>
        {editTitle && (
          <>
            <h2>Edit Post</h2>
            <label htmlFor="editTitle">Title:</label>
            <input
              id="editTitle"
              type="text"
              required
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <label htmlFor="editBody">Body:</label>
            <textarea
              id="editBody"
              type="text"
              required
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
            />
            <button type="submit" onClick={() => handleEdit(post.id)}>
              Submit
            </button>
          </>
        )}
        {!editTitle && (
          <>
            <h2>Page not found</h2>
            <p>well, that's disappointing</p>
            <p>visit our home page</p>
          </>
        )}
      </form>
    </main>
  );
};
