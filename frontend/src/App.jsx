import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import QuizList from "./pages/QuizList";
import QuizAttempt from "./pages/QuizAttempt";
import Result from "./pages/Result";
import ForgotPassword from "./pages/ForgotPassword";
import EditQuiz from "./admin/EditQuiz";

import AdminDashboard from "./admin/AdminDashboard";
import ManageQuizzes from "./admin/ManageQuizzes";
import ManageUsers from "./admin/ManageUsers";
import CreateQuiz from "./admin/CreateQuiz";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User Protected */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute>
              <QuizAttempt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result/:id"
          element={
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/quizzes"
          element={
            <AdminRoute>
              <ManageQuizzes />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/create-quiz"
          element={
            <AdminRoute>
              <CreateQuiz />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/edit-quiz/:id"
          element={
            <AdminRoute>
              <EditQuiz />
            </AdminRoute>
          }
        />
      </Routes>

      <Footer />
    </>
  );
}
