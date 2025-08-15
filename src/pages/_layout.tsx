import { lazy, Suspense } from "react";
import { useRoutes } from "react-router";
import { Sidebar } from "../components/sidebar/Sidebar";

const DashboardHomePage = lazy(() => import("./dashboard/DashboardPage"));
const EmailPage = lazy(() => import("./EmailPage"));
const ChatPage = lazy(() => import("./ChatPage"));
const UserPage = lazy(() => import("./UserPage"));
const ProjectsPage = lazy(() => import("./project/_layout"));
const DashboardLayout = () => {
  const element = useRoutes([
    {
      path: "",
      children: [
        {
          path: "/dashboard",
          element: <DashboardHomePage />,
        },
        {
          path: "/projects/*",
          element: <ProjectsPage />,
        },
        {
          path: "/email",
          element: <EmailPage />,
        },
        {
          path: "/chat",
          element: <ChatPage />,
        },
        {
          path: "/user",
          element: <UserPage />,
        },
      ],
    },
  ]);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full">
              Đang tải...
            </div>
          }
        >
          {element}
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardLayout;
