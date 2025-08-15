import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Plus, FolderOpen, Calendar, User } from "lucide-react";

const ProjectsPage = () => {
  const { t } = useTranslation(['projects', 'common']);
  // Mock data for projects
  const projects = [
    {
      id: 1,
      name: "Website E-commerce",
      description: "Dự án phát triển website bán hàng trực tuyến",
      createdAt: "2024-01-15",
      members: 5,
      status: "active",
    },
    {
      id: 2,
      name: "Mobile App",
      description: "���ng dụng di động quản lý công việc",
      createdAt: "2024-01-10",
      members: 3,
      status: "planning",
    },
    {
      id: 3,
      name: "Dashboard Analytics",
      description: "Hệ thống dashboard báo cáo và phân tích",
      createdAt: "2024-01-08",
      members: 4,
      status: "completed",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300";
      case "planning":
        return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300";
      case "completed":
        return "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    return t(`projects:status.${status}`);
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('projects:title')}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('projects:subtitle')}
            </p>
          </div>
          <Button asChild>
            <Link to="/projects/create">
              <Plus className="mr-2 h-4 w-4" />
              {t('projects:createNew')}
            </Link>
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <FolderOpen className="h-8 w-8 text-blue-600" />
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusText(project.status)}
                  </span>
                </div>
                <CardTitle className="text-lg dark:text-white">{project.name}</CardTitle>
                <CardDescription className="dark:text-gray-400">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="mr-2 h-4 w-4" />
                    {t('projects:details.createdAt')}:{" "}
                    {new Date(project.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <User className="mr-2 h-4 w-4" />
                    {project.members} {t('projects:details.members')}
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    {t('projects:viewDetails')}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t('common:actions.edit')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {t('projects:empty.title')}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('projects:empty.subtitle')}
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link to="/projects/create">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('projects:createNew')}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
