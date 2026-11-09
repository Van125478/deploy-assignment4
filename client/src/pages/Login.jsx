import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { clearAuthError, login } from "../slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const { user, token, status, error } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (token && user) {
    return <Navigate to={user.admin ? "/admin" : "/dashboard"} replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login({ username, password }));
  };

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center px-3">
      <div className="card auth-card shadow-sm">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Login</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                className="form-control"
                value={username}
                onChange={(event) => {
                  dispatch(clearAuthError());
                  setUsername(event.target.value);
                }}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="input-group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(event) => {
                    dispatch(clearAuthError());
                    setPassword(event.target.value);
                  }}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                </button>
              </div>
            </div>

            <button className="btn btn-primary w-100" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            <Link to="/register">Don&apos;t have an account? Register here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;
