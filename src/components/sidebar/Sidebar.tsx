import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { cn } from "../../lib/utils";
import { FolderOpen, Mail, MessageCircle, User, LogOut } from "lucide-react";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export const Sidebar = () => {
  const { t } = useTranslation(['common']);
  const location = useLocation();
  const dispatch = useAppDispatch();

  const menuItems = useMemo(() => [
    {
      label: t('common:navigation.projects'),
      icon: FolderOpen,
      path: "/projects",
    },
    {
      label: t('common:navigation.email'),
      icon: Mail,
      path: "/email",
    },
    {
      label: t('common:navigation.chat'),
      icon: MessageCircle,
      path: "/chat",
    },
  ], [t]);

  const bottomMenuItems = useMemo(() => [
    {
      label: t('common:navigation.user'),
      icon: User,
      path: "/user",
    },
  ], [t]);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 h-full overflow-hidden flex-shrink-0">
      <TooltipProvider>
        {/* Logo */}
        <div className="mb-8">
          <Link to="/dashboard" className="block p-2">
            <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
          </Link>
        </div>

        {/* Main Menu Items */}
        <nav className="flex flex-col space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                      isActive
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom Menu Items */}
        <div className="mt-auto flex flex-col space-y-2">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.path}
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                      isActive
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Logout Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="w-12 h-12 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{t('common:actions.logout')}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};
