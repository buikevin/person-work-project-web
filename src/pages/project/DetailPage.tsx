import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../../components/ui/resizable";
import { useProject } from "../../hooks/useProjects";
import {
  mapGraphQLProjectToLocal,
  UIProject,
} from "../../utils/projectMappers";
import { buildFileTree, TreeFileNode } from "../../utils/fileTreeUtils";
import { useNavigate } from "react-router";
import { ProjectHeader } from "../../components/project/ProjectHeader";
import { MainEditorArea } from "../../components/project/MainEditorArea";
import { RightSidePanel } from "../../components/project/RightSidePanel";
import { FileExplorer } from "@/components/project/FileExplorer";
import { useAppSelector } from "../../store/hooks";

interface OpenTab {
  id: string;
  name: string;
  path: string;
  node: TreeFileNode;
  isActive: boolean;
}

const ProjectDetailPage = () => {
  const { t } = useTranslation(["projects", "common"]);
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [showLeftExplorer, setShowLeftExplorer] = useState(true);
  const [activeRightPanel, setActiveRightPanel] = useState<"ai" | "doc" | null>(
    null
  );
  const [fileTree, setFileTree] = useState<TreeFileNode[]>([]);
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Get user ID from Redux store or localStorage
  const { user } = useAppSelector((state) => state.auth);
  const userId = user?._id || localStorage.getItem('userId') || '';

  // Use GraphQL hook to fetch project data
  const {
    project: graphqlProject,
    loading: isLoading,
    error,
  } = useProject(projectId || "");

  // Map GraphQL project to local format with id field
  const project: UIProject | null = graphqlProject
    ? mapGraphQLProjectToLocal(graphqlProject)
    : null;

  // Determine if project was not found
  const notFound = !isLoading && !project && !error;

  const handleFileSelect = (file: TreeFileNode, path: string) => {
    const existingTab = openTabs.find((tab) => tab.path === path);

    if (existingTab) {
      // Tab already exists, just activate it
      setActiveTabId(existingTab.id);
      setOpenTabs((tabs) =>
        tabs.map((tab) => ({
          ...tab,
          isActive: tab.id === existingTab.id,
        }))
      );
    } else {
      // Create new tab
      const newTabId = `tab-${Date.now()}-${Math.random()}`;
      const newTab: OpenTab = {
        id: newTabId,
        name: file.name,
        path,
        node: file,
        isActive: true,
      };

      setOpenTabs((tabs) => [
        ...tabs.map((tab) => ({ ...tab, isActive: false })),
        newTab,
      ]);
      setActiveTabId(newTabId);
    }
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTabId(tabId);
    setOpenTabs((tabs) =>
      tabs.map((tab) => ({
        ...tab,
        isActive: tab.id === tabId,
      }))
    );
  };

  const handleTabClose = (tabId: string) => {
    const tabIndex = openTabs.findIndex((tab) => tab.id === tabId);
    const newTabs = openTabs.filter((tab) => tab.id !== tabId);

    if (activeTabId === tabId) {
      // If closing active tab, activate another tab
      if (newTabs.length > 0) {
        const newActiveIndex = Math.min(tabIndex, newTabs.length - 1);
        const newActiveTab = newTabs[newActiveIndex];
        setActiveTabId(newActiveTab.id);
        newTabs[newActiveIndex] = { ...newActiveTab, isActive: true };
      } else {
        setActiveTabId(null);
      }
    }

    setOpenTabs(newTabs);
  };

  const toggleLeftExplorer = () => {
    setShowLeftExplorer(!showLeftExplorer);
  };

  const handleRightPanelChange = (panel: "ai" | "doc" | null) => {
    setActiveRightPanel(panel);
  };

  // Build file tree from flat structure when project loads
  useEffect(() => {
    if (graphqlProject?.content && graphqlProject.content.length > 0) {
      const tree = buildFileTree(graphqlProject.content);
      setFileTree(tree);
    }
  }, [graphqlProject]);

  const activeTab = openTabs.find((tab) => tab.id === activeTabId);

  if (isLoading) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center h-14 px-4">
            <Skeleton className="h-8 w-20 mr-4" />
            <Skeleton className="h-6 w-48" />
          </div>
        </header>
        <div className="h-[calc(100vh-56px)]">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  if (error || notFound || (!isLoading && !project)) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center h-14 px-4">
            <Button
              onClick={() => navigate("/projects")}
              variant="ghost"
              size="sm"
              className="mr-4"
            >
              ← {t("common:actions.back", "Quay lại")}
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("projects:notFound.title", "Dự án không tồn tại")}
            </h1>
          </div>
        </header>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4">
                🚫
              </div>
              <h2 className="text-lg font-medium mb-2 dark:text-white">
                {t("projects:notFound.heading", "Dự án không tìm thấy")}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error
                  ? `Lỗi tải dự án: ${error.message}`
                  : t(
                      "projects:notFound.description",
                      "Dự án bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
                    )}
              </p>
              <Button onClick={() => navigate("/projects")}>
                {t("projects:notFound.backToList", "Quay về danh sách dự án")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <ProjectHeader project={project} graphqlProject={graphqlProject} />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Explorer Panel - only show when enabled */}
          {showLeftExplorer && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                <FileExplorer
                  files={fileTree}
                  onFileSelect={handleFileSelect}
                  selectedFile={activeTab?.path || null}
                  isCollapsed={false}
                  onToggleCollapse={toggleLeftExplorer}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Main Editor Area */}
          <ResizablePanel
            defaultSize={
              activeRightPanel
                ? showLeftExplorer
                  ? 50
                  : 70
                : showLeftExplorer
                ? 70
                : 90
            }
            minSize={30}
          >
            <MainEditorArea
              openTabs={openTabs}
              activeTabId={activeTabId}
              onTabSelect={handleTabSelect}
              onTabClose={handleTabClose}
            />
          </ResizablePanel>

          {/* Right Panel and Sidebar */}
          {activeRightPanel && <ResizableHandle withHandle />}
          <RightSidePanel
            showLeftExplorer={showLeftExplorer}
            activeRightPanel={activeRightPanel}
            onToggleLeftExplorer={toggleLeftExplorer}
            onRightPanelChange={handleRightPanelChange}
            project={graphqlProject || undefined}
            userId={userId}
          />
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
