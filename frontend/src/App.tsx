import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";

import { useAuthStore } from "./store/authStore";

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

function Dashboard () {
  return (
    <div className="min-h-screen bg-background text-white p-10">
      <h1 className="text-5xl font-bold">
        Dashboard
      </h1>
    </div>
  );
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
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}