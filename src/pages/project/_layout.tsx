import { lazy } from "react";
import { useRoutes } from "react-router";

const ProjectListPage = lazy(() => import("./ListPage"));
const CreatePage = lazy(() => import("./CreatePage"));
const AddPage = lazy(() => import("./AddPage"));
const ProjectPage = lazy(() => import("./DetailPage"));

const LayoutProject = () => {
  const element = useRoutes([
    {
      path: "",

      children: [
        {
          path: "/",
          element: <ProjectListPage />,
        },
        {
          path: "/create",
          element: <CreatePage />,
        },
        {
          path: "/add",
          element: <AddPage />,
        },
        { path: ":projectId", element: <ProjectPage /> },
      ],
    },
  ]);
  return element;
};
export default LayoutProject;
