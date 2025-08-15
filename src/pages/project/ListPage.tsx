import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../../components/ui/card";
import { ProjectListSkeleton } from "../../components/ui/skeleton";
import ProjectCard from "../../components/projects/ProjectCard";
import { useProjects } from "../../hooks/useProjects";
import { mapGraphQLProjectToLocal } from "../../utils/projectMappers";
import { Plus, FolderPlus, Search, Filter, RefreshCw } from "lucide-react";
import { Input } from "../../components/ui/input";
import { cn } from "../../lib/utils";

const ProjectListPage = () => {
  const { t } = useTranslation(["projects", "common"]);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");


  // Sử dụng GraphQL hook để fetch projects
  const { projects: graphqlProjects, loading, error, refetchProjects, hasProjects } = useProjects();

  // Map GraphQL projects to local format
  const projects = useMemo(() => 
    graphqlProjects.map(mapGraphQLProjectToLocal), 
    [graphqlProjects]
  );

  // Filter projects based on search term
  const filteredProjects = useMemo(() => 
    projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ), 
    [projects, searchTerm]
  );

  const handleCreateProject = () => {
    navigate("/projects/create");
  };

  const handleAddProject = () => {
    navigate("/projects/add");
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const handleRefresh = () => {
    refetchProjects();
  };

  return (
    <div className={cn("h-full flex flex-col bg-gray-50", isDarkMode && "dark:bg-gray-900")}>
      {/* Header */}
      <header className={cn("bg-white border-b border-gray-200 flex-shrink-0", isDarkMode && "dark:bg-gray-800 dark:border-gray-700")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className={cn("text-2xl font-bold text-gray-900", isDarkMode && "dark:text-white")}>
                {t("projects:title")}
              </h1>
              <span className={cn("text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full", isDarkMode && "dark:text-gray-400 dark:bg-gray-700")}>
                {projects.length} {t("projects:details.projects", "dự án")}
              </span>
              {error && (
                <span className="text-sm text-red-500 bg-red-100 dark:bg-red-900/20 px-2 py-1 rounded-full">
                  Lỗi tải dữ liệu
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Làm mới
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex gap-3">
              <Button
                onClick={handleCreateProject}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {t("projects:createNew")}
              </Button>
              <Button
                onClick={handleAddProject}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FolderPlus className="h-4 w-4" />
                {t("projects:form.add", "Thêm dự án")}
              </Button>
            </div>

            <div className="flex gap-3 flex-1 sm:max-w-md sm:ml-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder={t(
                    "projects:form.searchPlaceholder",
                    "Tìm kiếm dự án..."
                  )}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className={cn("text-sm text-gray-600", isDarkMode && "dark:text-gray-400")}>
                    {t("projects:form.loading", "Đang tải dự án...")}
                  </p>
                </div>
              </div>
              <ProjectListSkeleton />
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project.id)}
                />
              ))}
            </div>
          ) : searchTerm ? (
            <Card className={cn("text-center py-12", isDarkMode && "dark:bg-gray-800 dark:border-gray-700")}>
              <CardContent>
                <div className="max-w-md mx-auto">
                  <Search className={cn("h-12 w-12 text-gray-400 mx-auto mb-4", isDarkMode && "dark:text-gray-600")} />
                  <CardTitle className={cn("text-lg mb-2", isDarkMode && "dark:text-white")}>
                    {t("projects:search.notFound", "Không tìm thấy dự án")}
                  </CardTitle>
                  <CardDescription className={cn(isDarkMode && "dark:text-gray-400")}>
                    {t(
                      "projects:search.notFoundDesc",
                      "Không có dự án nào khớp với từ khóa"
                    )}
                    &nbsp;"{searchTerm}".&nbsp;
                    {t(
                      "projects:search.tryAgain",
                      "Hãy thử tìm kiếm với từ khóa khác."
                    )}
                  </CardDescription>
                  <Button
                    variant="outline"
                    onClick={() => setSearchTerm("")}
                    className="mt-4"
                  >
                    {t("projects:form.clearFilter", "Xóa bộ lọc")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className={cn("text-center py-12", isDarkMode && "dark:bg-gray-800 dark:border-gray-700")}>
              <CardContent>
                <div className="max-w-md mx-auto">
                  <FolderPlus className={cn("h-12 w-12 text-gray-400 mx-auto mb-4", isDarkMode && "dark:text-gray-600")} />
                  <CardTitle className={cn("text-lg mb-2", isDarkMode && "dark:text-white")}>
                    {t("projects:empty.title")}
                  </CardTitle>
                  <CardDescription className={cn("mb-6", isDarkMode && "dark:text-gray-400")}>
                    {t("projects:empty.subtitle")}
                  </CardDescription>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={handleCreateProject}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t("projects:createNew")}
                    </Button>
                    <Button onClick={handleAddProject} variant="outline">
                      <FolderPlus className="mr-2 h-4 w-4" />
                      {t("projects:form.add", "Thêm dự án")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectListPage;
