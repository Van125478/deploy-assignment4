import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import ArticlesPage from "./pages/ArticlesPage";
import Login from "./pages/Login";
import ManageArticles from "./pages/ManageArticles";
import ManageQuestions from "./pages/ManageQuestions";
import QuizPage from "./pages/QuizPage";
import Register from "./pages/Register";

function HomeRedirect() {
  const { token, user } = useSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={user.admin ? "/admin" : "/dashboard"} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={null} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="articles" element={<ArticlesPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <DashboardLayout admin />
          </ProtectedRoute>
        }
      >
        <Route index element={null} />
        <Route path="questions" element={<ManageQuestions />} />
        <Route path="articles" element={<ManageArticles />} />
      </Route>

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}

export default App;
