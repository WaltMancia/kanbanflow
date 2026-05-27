import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage
  from "./features/auth/pages/LoginPage";

import DashboardPage
  from "./pages/DashboardPage";

import { useAuthStore }
  from "./features/auth/store/authStore";

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
      </Routes>
    </BrowserRouter>
  );
}