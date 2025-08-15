
import { useState, useEffect, startTransition, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../../components/ui/resizable';
import { useProject } from '../../hooks/useProjects';
import { mapGraphQLProjectToLocal, UIProject, getProjectStatusVariant } from '../../utils/projectMappers';
import { ProjectStatus, FileNode } from '../../graphql/project';
import { buildFileTree, TreeFileNode } from '../../utils/fileTreeUtils';
import { 
  ArrowLeft, 
  Code, 
  FileText, 
  MessageSquare, 
  Folder, 
  FolderOpen, 
  File,
  ChevronRight,
  ChevronDown,
  X,
  ChevronLeft,
  ChevronUp,
  Menu,
  Bot,
  Search,
  Image as ImageIcon
} from 'lucide-react';
import { Editor as LexicalEditor } from '../../components/blocks/editor-00/editor';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { cn } from '../../lib/utils';

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
        >
          <File className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
          <span>{node.name}</span>
        </div>
      );
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2 mb-2"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gray-50 dark:bg-gray-900">
      <div className="p-2 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('projects:editor.explorer', 'Explorer')}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-1"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="py-2">
        {files.map(file => renderFileNode(file))}
      </div>
    </div>
  );
};

const ChatPanel = ({
  isCollapsed,
  onToggleCollapse
}: {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}) => {
  const { t } = useTranslation(['projects', 'common']);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: t('projects:chat.welcomeMessage', 'Xin chào! Tôi có thể giúp bạn với mã nguồn và tài liệu. Bạn cần trợ giúp gì?') },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    startTransition(() => {
      setMessages(prev => [...prev,
        { role: 'user', content: inputMessage },
        { role: 'assistant', content: t('projects:chat.responseMessage', 'Tôi hiểu yêu cầu của bạn. Hãy để tôi phân tích và đưa ra gợi ý...') }
      ]);
      setInputMessage('');
    });
  };

  if (isCollapsed) {
    return (
      <div className="w-12 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col items-center py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2 mb-2"
        >
          <Bot className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="p-3 border-b dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <MessageSquare className="h-4 w-4 mr-2" />
          {t('projects:chat.title', 'AI Assistant')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-1"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {messages.map((message, index) => (
          <div key={index} className={cn(
            "p-3 rounded-lg max-w-[80%]",
            message.role === 'user'
              ? "bg-blue-500 dark:bg-blue-600 text-white ml-auto"
              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          )}>
            <p className="text-sm">{message.content}</p>
          </div>
        ))}
      </div>
      <div className="p-3 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t('projects:chat.placeholder', 'Hỏi AI...')}
            className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
          />
          <Button size="sm" onClick={sendMessage}>
            {t('common:actions.send', 'Gửi')}
          </Button>
        </div>
      </div>
    </div>
  );
};

const RightSidebar = ({
  activePanel,
  onPanelChange
}: {
  activePanel: 'explorer' | 'ai' | 'doc' | null;
  onPanelChange: (panel: 'explorer' | 'ai' | 'doc' | null) => void;
}) => {
  const { t } = useTranslation(['projects', 'common']);

  return (
    <div className="w-12 h-full bg-gray-100 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col items-center py-2 gap-1">
      <Button
        variant={activePanel === 'explorer' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onPanelChange(activePanel === 'explorer' ? null : 'explorer')}
        className="p-2 w-10 h-10"
        title="Explorer"
      >
        <Search className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activePanel === 'ai' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onPanelChange(activePanel === 'ai' ? null : 'ai')}
        className="p-2 w-10 h-10"
        title="AI Assistant"
      >
        <Bot className="h-4 w-4" />
      </Button>
      
      <Button
        variant={activePanel === 'doc' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onPanelChange(activePanel === 'doc' ? null : 'doc')}
        className="p-2 w-10 h-10"
        title="Document"
      >
        <FileText className="h-4 w-4" />
      </Button>
    </div>
  );
};

const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return imageExtensions.includes(ext);
};

const ImageViewer = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-full max-h-full">
        <img 
          src={src} 
          alt={alt}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.innerHTML = `
              <div class="flex flex-col items-center text-gray-500 dark:text-gray-400">
                <div class="h-12 w-12 mb-4">📷</div>
                <p>Cannot load image</p>
                <p class="text-sm">${alt}</p>
              </div>
            `;
          }}
        />
      </div>
    </div>
  );
};

const TabBar = ({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose
}: {
  tabs: OpenTab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={cn(
            "flex items-center min-w-0 max-w-[200px] border-r dark:border-gray-700 group",
            tab.isActive
              ? "bg-blue-50 dark:bg-blue-900/20 border-b-2 border-b-blue-500"
              : "hover:bg-gray-50 dark:hover:bg-gray-700"
          )}
        >
          <button
            onClick={() => onTabSelect(tab.id)}
            className={cn(
              "flex items-center px-3 py-2 text-sm min-w-0 flex-1",
              tab.isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400"
            )}
          >
            <File className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{tab.name}</span>
          </button>
          <button
            onClick={() => onTabClose(tab.id)}
            className="p-1 mr-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-opacity"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

const ProjectDetailPage = () => {
  const { t } = useTranslation(['projects', 'common']);
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [activeRightPanel, setActiveRightPanel] = useState<'explorer' | 'ai' | 'doc' | null>(null);
  const [explorerCollapsed, setExplorerCollapsed] = useState(false);
  const [chatCollapsed, setChatCollapsed] = useState(false);
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

  const toggleExplorerCollapse = () => {
    setExplorerCollapsed(!explorerCollapsed);
  };

  const toggleChatCollapse = () => {
    setChatCollapsed(!chatCollapsed);
  };

  const handleRightPanelChange = (panel: 'explorer' | 'ai' | 'doc' | null) => {
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
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common:actions.back', 'Quay lại')}
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
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center">
            <Button
              onClick={() => navigate('/projects')}
              variant="ghost"
              size="sm"
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common:actions.back', 'Quay lại')}
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {project.name}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                /{project.slug}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={getProjectStatusVariant(project.status)}
              className="text-xs"
            >
              {t(`projects:status.${project.status.toLowerCase()}`)}
            </Badge>
            {/* Display metadata badges */}
            {graphqlProject?.metadata && (
              <>
                {graphqlProject.metadata.backend && (
                  <Badge variant="outline" className="text-xs">
                    {graphqlProject.metadata.backend}
                  </Badge>
                )}
                {graphqlProject.metadata.frontend && (
                  <Badge variant="outline" className="text-xs">
                    {graphqlProject.metadata.frontend}
                  </Badge>
                )}
                {graphqlProject.metadata.database && (
                  <Badge variant="outline" className="text-xs">
                    {graphqlProject.metadata.database}
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Explorer Panel */}
          {!explorerCollapsed && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                <FileExplorer
                  files={fileTree}
                  onFileSelect={handleFileSelect}
                  selectedFile={activeTab?.path || null}
                  isCollapsed={false}
                  onToggleCollapse={toggleExplorerCollapse}
                />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {explorerCollapsed && (
            <div className="w-12 flex-shrink-0">
              <FileExplorer
                files={fileTree}
                onFileSelect={handleFileSelect}
                selectedFile={activeTab?.path || null}
                isCollapsed={true}
                onToggleCollapse={toggleExplorerCollapse}
              />
            </div>
          )}

          {/* Main Editor Area */}
          <ResizablePanel 
            defaultSize={explorerCollapsed && chatCollapsed ? 90 : explorerCollapsed || chatCollapsed ? 70 : 60} 
            minSize={30}
          >
            <div className="h-full flex flex-col">
              {/* Tab Bar */}
              {openTabs.length > 0 && (
                <TabBar
                  tabs={openTabs}
                  activeTabId={activeTabId}
                  onTabSelect={handleTabSelect}
                  onTabClose={handleTabClose}
                />
              )}

              {/* Editor Content */}
              <div className="flex-1 overflow-hidden">
                {activeTab ? (
                  <div className="h-full flex flex-col">
                    <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activeTab.path}</p>
                    </div>
                    <div className="flex-1">
                      <Suspense fallback={
                        <div className="h-full flex items-center justify-center">
                          <div className="text-gray-500 dark:text-gray-400">{t('projects:editor.loading', 'Đang tải editor...')}</div>
                        </div>
                      }>
                        {isImageFile(activeTab.name) ? (
                          <ImageViewer
                            src={`data:image/png;base64,${activeTab.node.content || ''}`}
                            alt={activeTab.name}
                          />
                        ) : activeTab.node.content ? (
                          <MonacoEditor
                            height="100%"
                            language={activeTab.node.language || 'text'}
                            value={activeTab.node.content}
                            theme={isDarkMode ? "vs-dark" : "vs-light"}
                            options={{
                              fontSize: 14,
                              lineNumbers: 'on',
                              minimap: { enabled: false },
                              scrollBeyondLastLine: false,
                              automaticLayout: true,
                            }}
                            key={activeTab.path}
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                            <div className="text-center">
                              <File className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                              <p>File content not available</p>
                              <p className="text-sm">Type: {activeTab.node.type}</p>
                            </div>
                          </div>
                        )}
                      </Suspense>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    <div className="text-center">
                      <Code className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p>{t('projects:editor.selectFile', 'Chọn một file để bắt đầu chỉnh sửa')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          {/* Right AI Chat Panel */}
          {!chatCollapsed && activeRightPanel !== 'doc' && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                <ChatPanel
                  isCollapsed={false}
                  onToggleCollapse={toggleChatCollapse}
                />
              </ResizablePanel>
            </>
          )}

          {/* Right Document Panel */}
          {!chatCollapsed && activeRightPanel === 'doc' && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                <div className="h-full flex flex-col bg-white dark:bg-gray-800">
                  <div className="p-3 border-b dark:border-gray-700 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      {t('projects:editor.doc', 'Document')}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleChatCollapse}
                      className="p-1"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex-1 p-4">
                    <Suspense fallback={
                      <div className="h-full flex items-center justify-center">
                        <div className="text-gray-500 dark:text-gray-400">{t('projects:editor.loading', 'Đang tải editor...')}</div>
                      </div>
                    }>
                      <LexicalEditor />
                    </Suspense>
                  </div>
                </div>
              </ResizablePanel>
            </>
          )}

          {(chatCollapsed || activeRightPanel !== null) && (
            <div className="flex-shrink-0">
              {chatCollapsed ? (
                <ChatPanel
                  isCollapsed={true}
                  onToggleCollapse={toggleChatCollapse}
                />
              ) : (
                <RightSidebar
                  activePanel={activeRightPanel}
                  onPanelChange={handleRightPanelChange}
                />
              )}
            </div>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
