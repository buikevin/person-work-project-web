
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ArrowLeft } from 'lucide-react';
import { UIProject, getProjectStatusVariant } from '../../utils/projectMappers';
import { Project } from '../../graphql/project';

interface ProjectHeaderProps {
  project: UIProject;
  graphqlProject?: Project;
}

export const ProjectHeader = ({ project, graphqlProject }: ProjectHeaderProps) => {
  const { t } = useTranslation(['projects', 'common']);
  const navigate = useNavigate();

  return (
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
  );
};
