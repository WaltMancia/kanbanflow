import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage
  from "./pages/LoginPage";

import DashboardPage
  from "./pages/DashboardPage";

import { useAuthStore }
  from "./store/authStore";

import KanbanPage
  from "./features/kanban/pages/KanbanPage";

import { Toaster }
  from "react-hot-toast";

function ProtectedRoute ({
  children,
}: {
  children: React.ReactNode;
}) {
  const token =
    useAuthStore(
      (state) => state.token
    );

  if (!token) {
    return (
      <Navigate to="/login" />
    );
  }

  return children;
}

export default function App () {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
      />
      <Routes>
        <Route
          path="/login"
          element={ <LoginPage /> }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kanban"
          element={
            <ProtectedRoute>
              <KanbanPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}