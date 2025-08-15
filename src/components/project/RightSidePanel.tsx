
import { useState, startTransition, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';
import { 
  MessageSquare, 
  FileText, 
  Folder, 
  Bot, 
  BookOpen, 
  CopyMinus 
} from 'lucide-react';
import { Editor as LexicalEditor } from '../blocks/editor-00/editor';
import { cn } from '../../lib/utils';
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from '../ui/tooltip';

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
          <CopyMinus className="h-4 w-4" />
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

const DocumentPanel = ({
  onToggleCollapse
}: {
  onToggleCollapse: () => void;
}) => {
  const { t } = useTranslation(['projects', 'common']);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="p-3 border-b dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          {t('projects:editor.doc', 'Document')}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-1"
        >
          <CopyMinus className="h-4 w-4" />
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
  );
};

const RightSidebar = ({
  showLeftExplorer,
  activeRightPanel,
  onToggleLeftExplorer,
  onRightPanelChange
}: {
  showLeftExplorer: boolean;
  activeRightPanel: 'ai' | 'doc' | null;
  onToggleLeftExplorer: () => void;
  onRightPanelChange: (panel: 'ai' | 'doc' | null) => void;
}) => {
  const { t } = useTranslation(['projects', 'common']);

  const menuItems = [
    {
      id: 'explorer' as const,
      label: t('projects:editor.explorer', 'Explorer'),
      icon: Folder,
      onClick: onToggleLeftExplorer,
      isActive: showLeftExplorer,
    },
    {
      id: 'ai' as const,
      label: t('projects:chat.title', 'AI Assistant'),
      icon: Bot,
      onClick: () => onRightPanelChange(activeRightPanel === 'ai' ? null : 'ai'),
      isActive: activeRightPanel === 'ai',
    },
    {
      id: 'doc' as const,
      label: t('projects:editor.doc', 'Document'),
      icon: BookOpen,
      onClick: () => onRightPanelChange(activeRightPanel === 'doc' ? null : 'doc'),
      isActive: activeRightPanel === 'doc',
    },
  ];

  return (
    <div className="w-16 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 h-full overflow-hidden flex-shrink-0">
      <TooltipProvider>
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={item.onClick}
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
                      item.isActive
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    </div>
  );
};

interface RightSidePanelProps {
  showLeftExplorer: boolean;
  activeRightPanel: 'ai' | 'doc' | null;
  onToggleLeftExplorer: () => void;
  onRightPanelChange: (panel: 'ai' | 'doc' | null) => void;
}

export const RightSidePanel = ({
  showLeftExplorer,
  activeRightPanel,
  onToggleLeftExplorer,
  onRightPanelChange
}: RightSidePanelProps) => {
  return (
    <>
      {/* Right Panel - show content when activeRightPanel is set */}
      {activeRightPanel && (
        <div className="flex">
          <div className="w-80">
            {activeRightPanel === 'ai' && (
              <ChatPanel
                isCollapsed={false}
                onToggleCollapse={() => onRightPanelChange(null)}
              />
            )}
            {activeRightPanel === 'doc' && (
              <DocumentPanel
                onToggleCollapse={() => onRightPanelChange(null)}
              />
            )}
          </div>
        </div>
      )}

      {/* Right Sidebar - Always visible */}
      <RightSidebar
        showLeftExplorer={showLeftExplorer}
        activeRightPanel={activeRightPanel}
        onToggleLeftExplorer={onToggleLeftExplorer}
        onRightPanelChange={onRightPanelChange}
      />
    </>
  );
};
