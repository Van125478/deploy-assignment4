import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../slices/articleSlice";

function ArticlesPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.articles);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  return (
    <section>
      <h2 className="h4 mb-3">Articles</h2>
      {status === "loading" && <p>Loading articles...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {items.length === 0 && status !== "loading" && <p>No articles yet.</p>}

      {items.map((article) => (
        <article className="border rounded p-3 mb-3" key={article._id}>
          <h3 className="h5">{article.title}</h3>
          <p className="mb-0">{article.content}</p>
        </article>
      ))}
    </section>
  );
}

export default ArticlesPage;
