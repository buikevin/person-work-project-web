
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { File, Code } from 'lucide-react';
import { Editor as MonacoEditor } from '@monaco-editor/react';
import { TreeFileNode } from '../../utils/fileTreeUtils';

interface OpenTab {
  id: string;
  name: string;
  path: string;
  node: TreeFileNode;
  isActive: boolean;
}

interface TabBarProps {
  tabs: OpenTab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

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

const TabBar = ({ tabs, activeTabId, onTabSelect, onTabClose }: TabBarProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`flex items-center min-w-0 max-w-[200px] border-r dark:border-gray-700 group ${
            tab.isActive
              ? "bg-blue-50 dark:bg-blue-900/20 border-b-2 border-b-blue-500"
              : "hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <button
            onClick={() => onTabSelect(tab.id)}
            className={`flex items-center px-3 py-2 text-sm min-w-0 flex-1 ${
              tab.isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <File className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{tab.name}</span>
          </button>
          <button
            onClick={() => onTabClose(tab.id)}
            className="p-1 mr-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-opacity cursor-pointer"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

interface MainEditorAreaProps {
  openTabs: OpenTab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export const MainEditorArea = ({ 
  openTabs, 
  activeTabId, 
  onTabSelect, 
  onTabClose 
}: MainEditorAreaProps) => {
  const { t } = useTranslation(['projects', 'common']);
  const { isDarkMode } = useTheme();
  const activeTab = openTabs.find(tab => tab.id === activeTabId);

  return (
    <div className="h-full flex flex-col">
      {/* Tab Bar */}
      {openTabs.length > 0 && (
        <TabBar
          tabs={openTabs}
          activeTabId={activeTabId}
          onTabSelect={onTabSelect}
          onTabClose={onTabClose}
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
  );
};
