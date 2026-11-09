import { useDispatch, useSelector } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../slices/authSlice";

function DashboardLayout({ admin = false }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const links = admin
    ? [
        { to: "/admin", label: "Home", end: true },
        { to: "/admin/questions", label: "Manage Questions" },
        { to: "/admin/articles", label: "Manage Articles" },
      ]
    : [
        { to: "/dashboard", label: "Home", end: true },
        { to: "/dashboard/quiz", label: "Quiz" },
        { to: "/dashboard/articles", label: "Article" },
      ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="fw-bold mb-0">{admin ? "Admin Dashboard" : "Dashboard"}</h1>
        <div>Welcome, {user?.username}</div>
      </div>

      <nav className="bg-light rounded px-2 py-1 mb-4">
        <ul className="nav">
          {links.map((link) => (
            <li className="nav-item" key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active fw-semibold" : ""}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="nav-item">
            <button type="button" className="nav-link btn btn-link" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
}

export default DashboardLayout;
