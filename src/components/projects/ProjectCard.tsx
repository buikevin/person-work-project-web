import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, ExternalLink, FolderOpen } from 'lucide-react';
import { UIProject } from '../../utils/projectMappers';
import { getProjectStatusVariant, formatProjectStatus, getTechIcon } from '../../utils/projectMappers';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';
import moment from 'moment';

interface ProjectCardProps {
  project: UIProject;
  onClick: () => void;
}

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
  const { isDarkMode } = useTheme();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=300&fit=crop';
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] overflow-hidden bg-white",
        isDarkMode && "dark:bg-gray-800 dark:border-gray-700"
      )}
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        {project.avatar ? (
          <img
            src={project.avatar}
            alt={project.name}
            onError={handleImageError}
            className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className={cn(
            "w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center transition-transform duration-200 group-hover:scale-105",
            isDarkMode && "dark:from-blue-900/20 dark:to-purple-900/20"
          )}>
            <FolderOpen className={cn("h-16 w-16 text-gray-400", isDarkMode && "dark:text-gray-600")} />
          </div>
        )}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 dark:bg-gray-800/90">
            <ExternalLink className={cn("h-4 w-4 text-gray-600", isDarkMode && "dark:text-gray-300")} />
          </div>
        </div>
        {project.status && (
          <div className="absolute top-3 left-3">
            <Badge
              variant={getProjectStatusVariant(project.status)}
              className="text-xs"
            >
              {formatProjectStatus(project.status)}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className={cn(
              "font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-1",
              isDarkMode && "dark:text-white"
            )}>
              {project.name}
            </h3>
            <p className={cn("text-sm text-gray-500 font-mono", isDarkMode && "dark:text-gray-400")}>
              /{project.slug}
            </p>
          </div>

          {project.description && (
            <p className={cn("text-sm text-gray-600 line-clamp-2", isDarkMode && "dark:text-gray-300")}>
              {project.description}
            </p>
          )}

          {/* Tech Stack */}
          {project.metadata && (
            <div className="flex flex-wrap gap-1">
              {project.metadata.frontend && (
                <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                  {getTechIcon(project.metadata.frontend).icon} {project.metadata.frontend}
                </Badge>
              )}
              {project.metadata.backend && (
                <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                  {getTechIcon(project.metadata.backend).icon} {project.metadata.backend}
                </Badge>
              )}
              {project.metadata.database && (
                <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                  {getTechIcon(project.metadata.database).icon} {project.metadata.database}
                </Badge>
              )}
            </div>
          )}

          <div className={cn(
            "flex items-center text-xs text-gray-400 pt-2 border-t border-gray-100",
            isDarkMode && "dark:text-gray-500 dark:border-gray-700"
          )}>
            <Calendar className="h-3 w-3 mr-1" />
            <span>
              Tạo lúc {moment(project.createdAt).format('DD/MM/YYYY')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
