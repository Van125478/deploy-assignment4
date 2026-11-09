import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearArticleError,
  createArticle,
  deleteArticle,
  fetchArticles,
  updateArticle,
} from "../slices/articleSlice";

const emptyForm = { title: "", content: "" };

function ManageArticles() {
  const dispatch = useDispatch();
  const { items, error } = useSelector((state) => state.articles);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    dispatch(clearArticleError());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
    };

    const action = editingId
      ? await dispatch(updateArticle({ id: editingId, payload }))
      : await dispatch(createArticle(payload));

    if (action.meta.requestStatus === "fulfilled") {
      resetForm();
    }
  };

  return (
    <section>
      <h2 className="h4">Articles</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="border rounded p-3 mb-3" onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="form-control"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="content">
            Content
          </label>
          <textarea
            id="content"
            className="form-control"
            rows="3"
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
            required
          />
        </div>
        <button className="btn btn-primary w-100" type="submit">
          {editingId ? "Update Article" : "Add Article"}
        </button>
        {editingId && (
          <button type="button" className="btn btn-link w-100" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {items.map((article) => (
        <article className="border rounded p-3 mb-3" key={article._id}>
          <h3 className="h5">{article.title}</h3>
          <p>{article.content}</p>
          <button
            type="button"
            className="btn btn-warning btn-sm me-2"
            onClick={() => {
              setEditingId(article._id);
              setForm({ title: article.title, content: article.content });
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (window.confirm("Delete this article?")) {
                dispatch(deleteArticle(article._id));
                if (editingId === article._id) {
                  resetForm();
                }
              }
            }}
          >
            Delete
          </button>
        </article>
      ))}
    </section>
  );
}

export default ManageArticles;
