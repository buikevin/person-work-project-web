import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "../components/auth/PrivateRoute";
import PublicRoute from "../components/auth/PublicRoute";
import { lazy } from "react";

const LayoutHome = lazy(() => import("../pages/_layout"));

export const router = createBrowserRouter([
  {
    path: "/*",
    element: (
      <PrivateRoute>
        <LayoutHome />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
