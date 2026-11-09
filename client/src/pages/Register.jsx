import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate } from "react-router-dom";
import { clearAuthError, signup } from "../slices/authSlice";

function Register() {
  const dispatch = useDispatch();
  const { user, token, status, error } = useSelector((state) => state.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [localError, setLocalError] = useState("");

  if (token && user) {
    return <Navigate to={user.admin ? "/admin" : "/dashboard"} replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setLocalError("");
    dispatch(signup({ username, password, admin }));
  };

  return (
    <main className="min-vh-100 d-flex align-items-center justify-content-center px-3">
      <div className="card auth-card shadow-sm">
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Register</h2>

          {(localError || error) && (
            <div className="alert alert-danger" role="alert">
              {localError || error}
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
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>

            <div className="form-check mb-3">
              <input
                id="admin"
                className="form-check-input"
                type="checkbox"
                checked={admin}
                onChange={(event) => setAdmin(event.target.checked)}
              />
              <label className="form-check-label" htmlFor="admin">
                Register as admin
              </label>
            </div>

            <button className="btn btn-primary w-100" type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-3 mb-0">
            <Link to="/login">Already have an account? Login here</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
