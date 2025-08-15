import {
  Folder,
  FolderOpen,
  File,
  ChevronRight,
  ChevronDown,
  X,
  CopyMinus,
  FilePlus,
  FolderPlus,
  Edit,
  Trash2,
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { TreeFileNode } from "@/utils/fileTreeUtils";
import { startTransition, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../../components/ui/context-menu";

export const FileExplorer = ({
  files,
  onFileSelect,
  selectedFile,
  onToggleCollapse,
  setShowCreateDialog,
  handleAction,
}: {
  files: TreeFileNode[];
  onFileSelect: (file: TreeFileNode, path: string) => void;
  selectedFile: string | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  setShowCreateDialog: (type: 'file' | 'folder' | null) => void;
  handleAction: (node: TreeFileNode, path: string, action: string) => void;
}) => {
  const { t } = useTranslation(["projects", "common"]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["src"])
  );
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    node: TreeFileNode | null;
  } | null>(null);

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
    console.log("Create file in:", parentPath);
    hideContextMenu();
  };

  const handleCreateFolder = (parentPath: string) => {
    console.log("Create folder in:", parentPath);
    hideContextMenu();
  };

  const handleDeleteNode = (nodePath: string) => {
    console.log("Delete node:", nodePath);
    hideContextMenu();
  };

  const handleRenameNode = (nodePath: string) => {
    console.log("Rename node:", nodePath);
    hideContextMenu();
  };

  const renderFileNode = (
    node: TreeFileNode,

    depth: number = 0
  ) => {
    const fullPath = node.path;
    const isExpanded = expandedFolders.has(fullPath);
    const isSelected = selectedFile === fullPath;

    if (node.type === "folder" || node.type === "directory") {
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(node, fullPath, 'createFile');
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer"
                    >
                      <FilePlus className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {t("common:actions.createFile", "Create new file")}
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAction(node, fullPath, 'createFolder');
                      }}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer"
                    >
                      <FolderPlus className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {t("common:actions.createFolder", "Create new folder")}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          {isExpanded && node.children && node.children.length > 0 && (
            <div>
              {node.children.map((child) => renderFileNode(child, depth + 1))}
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
    <div
      className="h-full overflow-auto bg-gray-50 dark:bg-gray-900"
      onClick={hideContextMenu}
    >
      <div className="p-2 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("projects:editor.explorer", "Explorer")}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-1 cursor-pointer"
        >
          <CopyMinus className="h-4 w-4" />
        </Button>
      </div>
      <div className="py-2">{files.map((file) => renderFileNode(file))}</div>
      {contextMenu && (
        <ContextMenuContent
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute z-10 bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 px-2 border border-gray-200 dark:border-gray-600 text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <ul>
            {contextMenu.node && (
              <>
                <ContextMenuItem
                  onClick={() => handleAction(contextMenu.node!, contextMenu.node!.path, 'rename')}
                  className="text-sm cursor-pointer"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {t('projects:contextMenu.rename', 'Đổi tên')}
                </ContextMenuItem>
                {contextMenu.node.type === 'folder' && (
                  <>
                    <ContextMenuItem
                      onClick={() => handleAction(contextMenu.node!, contextMenu.node!.path, 'createFile')}
                      className="text-sm cursor-pointer"
                    >
                      <FilePlus className="h-4 w-4 mr-2" />
                      {t('projects:contextMenu.createFile', 'Tạo file')}
                    </ContextMenuItem>
                    <ContextMenuItem
                      onClick={() => handleAction(contextMenu.node!, contextMenu.node!.path, 'createFolder')}
                      className="text-sm cursor-pointer"
                    >
                      <FolderPlus className="h-4 w-4 mr-2" />
                      {t('projects:contextMenu.createFolder', 'Tạo folder')}
                    </ContextMenuItem>
                  </>
                )}
                <ContextMenuItem
                  onClick={() => handleAction(contextMenu.node!, contextMenu.node!.path, 'delete')}
                  className="text-sm text-red-600 dark:text-red-400 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('projects:contextMenu.delete', 'Xoá')}
                </ContextMenuItem>
              </>
            )}
          </ul>
        </ContextMenuContent>
      )}
    </div>
  );
};