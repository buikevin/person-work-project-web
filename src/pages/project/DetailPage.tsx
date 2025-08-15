
import { useState, useEffect, startTransition } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../../components/ui/resizable';
import { useProject } from '../../hooks/useProjects';
import { mapGraphQLProjectToLocal, UIProject } from '../../utils/projectMappers';
import { FileNode } from '../../graphql/project';
import { buildFileTree, TreeFileNode } from '../../utils/fileTreeUtils';
import { useNavigate } from 'react-router';
import { ProjectHeader } from '../../components/project/ProjectHeader';
import { MainEditorArea } from '../../components/project/MainEditorArea';
import { RightSidePanel } from '../../components/project/RightSidePanel';
import { 
  Folder, 
  FolderOpen, 
  File,
  ChevronRight,
  ChevronDown,
  X,
  CopyMinus,
  FilePlus,
  FolderPlus
} from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from '../../components/ui/tooltip';

// Mock data as flat structure to be converted by buildFileTree
const mockFlatFiles: FileNode[] = [
  { name: 'src', type: 'folder', path: 'src', parentPath: null, language: null },
  { name: 'components', type: 'folder', path: 'src/components', parentPath: 'src', language: null },
  { name: 'Header.tsx', type: 'file', path: 'src/components/Header.tsx', parentPath: 'src/components', language: 'typescript' },
  { name: 'Button.tsx', type: 'file', path: 'src/components/Button.tsx', parentPath: 'src/components', language: 'typescript' },
  { name: 'pages', type: 'folder', path: 'src/pages', parentPath: 'src', language: null },
  { name: 'Home.tsx', type: 'file', path: 'src/pages/Home.tsx', parentPath: 'src/pages', language: 'typescript' },
  { name: 'App.tsx', type: 'file', path: 'src/App.tsx', parentPath: 'src', language: 'typescript' },
  { name: 'index.css', type: 'file', path: 'src/index.css', parentPath: 'src', language: 'css' },
  { name: 'logo.png', type: 'file', path: 'src/logo.png', parentPath: 'src', language: null },
  { name: 'public', type: 'folder', path: 'public', parentPath: null, language: null },
  { name: 'index.html', type: 'file', path: 'public/index.html', parentPath: 'public', language: 'html' },
  { name: 'package.json', type: 'file', path: 'package.json', parentPath: null, language: 'json' },
  { name: 'README.md', type: 'file', path: 'README.md', parentPath: null, language: 'markdown' }
];

interface OpenTab {
  id: string;
  name: string;
  path: string;
  node: TreeFileNode;
  isActive: boolean;
}

const FileExplorer = ({
  files,
  onFileSelect,
  selectedFile,
  isCollapsed,
  onToggleCollapse
}: {
  files: TreeFileNode[];
  onFileSelect: (file: TreeFileNode, path: string) => void;
  selectedFile: string | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) => {
  const { t } = useTranslation(['projects', 'common']);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: TreeFileNode | null } | null>(null);

  const toggleFolder = (path: string) => {
    startTransition(() => {
      const newExpanded = new Set(expandedFolders);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      setExpandedFolders(newExpanded);
    });
  };

  const handleContextMenu = (e: React.MouseEvent, node: TreeFileNode) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  };

  const hideContextMenu = () => {
    setContextMenu(null);
  };

  const handleCreateFile = (parentPath: string) => {
    console.log('Create file in:', parentPath);
    hideContextMenu();
  };

  const handleCreateFolder = (parentPath: string) => {
    console.log('Create folder in:', parentPath);
    hideContextMenu();
  };

  const handleDeleteNode = (nodePath: string) => {
    console.log('Delete node:', nodePath);
    hideContextMenu();
  };

  const handleRenameNode = (nodePath: string) => {
    console.log('Rename node:', nodePath);
    hideContextMenu();
  };

  const renderFileNode = (node: TreeFileNode, parentPath: string = '', depth: number = 0) => {
    const fullPath = node.path;
    const isExpanded = expandedFolders.has(fullPath);
    const isSelected = selectedFile === fullPath;

    if (node.type === 'folder' || node.type === 'directory') {
      return (
        <div key={fullPath}>
          <div
            className={cn(
              "flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer select-none",
              "text-sm text-gray-900 dark:text-gray-100",
              isSelected && "bg-blue-100 dark:bg-blue-900"
            )}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => toggleFolder(fullPath)}
            onContextMenu={(e) => handleContextMenu(e, node)}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronRight className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
            )}
            {isExpanded ? (
              <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
            ) : (
              <Folder className="h-4 w-4 mr-2 text-blue-500" />
            )}
            <span>{node.name}</span>
            <div className="ml-auto flex items-center space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={(e) => { e.stopPropagation(); handleCreateFile(fullPath); }} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      <FilePlus className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {t('common:actions.createFile', 'Create new file')}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button onClick={(e) => { e.stopPropagation(); handleCreateFolder(fullPath); }} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
                      <FolderPlus className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {t('common:actions.createFolder', 'Create new folder')}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          {isExpanded && node.children && node.children.length > 0 && (
            <div>
              {node.children.map(child => renderFileNode(child, fullPath, depth + 1))}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div
          key={fullPath}
          className={cn(
            "flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer select-none",
            "text-sm text-gray-900 dark:text-gray-100",
            isSelected && "bg-blue-100 dark:bg-blue-900"
          )}
          style={{ paddingLeft: `${depth * 12 + 24}px` }}
          onClick={() => onFileSelect(node, fullPath)}
          onContextMenu={(e) => handleContextMenu(e, node)}
        >
          <File className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
          <span>{node.name}</span>
        </div>
      );
    }
  };

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900" onClick={hideContextMenu}>
      <div className="p-2 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('projects:editor.explorer', 'Explorer')}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-1"
        >
          <CopyMinus className="h-4 w-4" />
        </Button>
      </div>
      <div className="py-2">
        {files.map(file => renderFileNode(file))}
      </div>
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute z-10 bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 px-2 border border-gray-200 dark:border-gray-600 text-sm"
        >
          <ul>
            {contextMenu.node && (
              <>
                <li
                  onClick={() => handleCreateFile(contextMenu.node!.path)}
                  className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
                >
                  <FilePlus className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  {t('common:actions.createFile', 'Create new file')}
                </li>
                <li
                  onClick={() => handleCreateFolder(contextMenu.node!.path)}
                  className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
                >
                  <FolderPlus className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  {t('common:actions.createFolder', 'Create new folder')}
                </li>
                <li
                  onClick={() => handleRenameNode(contextMenu.node!.path)}
                  className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center"
                >
                  <File className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                  {t('common:actions.rename', 'Rename')}
                </li>
                <li
                  onClick={() => handleDeleteNode(contextMenu.node!.path)}
                  className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center text-red-500"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('common:actions.delete', 'Delete')}
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const ProjectDetailPage = () => {
  const { t } = useTranslation(['projects', 'common']);
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [showLeftExplorer, setShowLeftExplorer] = useState(true);
  const [activeRightPanel, setActiveRightPanel] = useState<'ai' | 'doc' | null>(null);
  const [fileTree, setFileTree] = useState<TreeFileNode[]>([]);
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);

  // Use GraphQL hook to fetch project data
  const { project: graphqlProject, loading: isLoading, error } = useProject(projectId || '');

  // Map GraphQL project to local format with id field
  const project: UIProject | null = graphqlProject ? mapGraphQLProjectToLocal(graphqlProject) : null;

  // Determine if project was not found
  const notFound = !isLoading && !project && !error;

  const handleFileSelect = (file: TreeFileNode, path: string) => {
    const existingTab = openTabs.find(tab => tab.path === path);

    if (existingTab) {
      // Tab already exists, just activate it
      setActiveTabId(existingTab.id);
      setOpenTabs(tabs => tabs.map(tab => ({
        ...tab,
        isActive: tab.id === existingTab.id
      })));
    } else {
      // Create new tab
      const newTabId = `tab-${Date.now()}-${Math.random()}`;
      const newTab: OpenTab = {
        id: newTabId,
        name: file.name,
        path,
        node: file,
        isActive: true
      };

      setOpenTabs(tabs => [
        ...tabs.map(tab => ({ ...tab, isActive: false })),
        newTab
      ]);
      setActiveTabId(newTabId);
    }
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTabId(tabId);
    setOpenTabs(tabs => tabs.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));
  };

  const handleTabClose = (tabId: string) => {
    const tabIndex = openTabs.findIndex(tab => tab.id === tabId);
    const newTabs = openTabs.filter(tab => tab.id !== tabId);

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

  const handleRightPanelChange = (panel: 'ai' | 'doc' | null) => {
    setActiveRightPanel(panel);
  };

  // Build file tree from flat structure when project loads
  useEffect(() => {
    if (graphqlProject?.content && graphqlProject.content.length > 0) {
      const tree = buildFileTree(graphqlProject.content);
      setFileTree(tree);
    } else {
      // Fallback to mock data converted to tree structure
      setFileTree(buildFileTree(mockFlatFiles));
    }
  }, [graphqlProject]);

  const activeTab = openTabs.find(tab => tab.id === activeTabId);

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
              onClick={() => navigate('/projects')}
              variant="ghost"
              size="sm"
              className="mr-4"
            >
              ← {t('common:actions.back', 'Quay lại')}
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('projects:notFound.title', 'Dự án không tồn tại')}
            </h1>
          </div>
        </header>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4">🚫</div>
              <h2 className="text-lg font-medium mb-2 dark:text-white">{t('projects:notFound.heading', 'Dự án không tìm thấy')}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error
                  ? `Lỗi tải dự án: ${error.message}`
                  : t('projects:notFound.description', 'Dự án bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.')
                }
              </p>
              <Button onClick={() => navigate('/projects')}>
                {t('projects:notFound.backToList', 'Quay về danh sách dự án')}
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
            defaultSize={activeRightPanel ? (showLeftExplorer ? 50 : 70) : (showLeftExplorer ? 70 : 90)} 
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
          />
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
