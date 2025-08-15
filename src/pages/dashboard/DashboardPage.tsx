import { useAppSelector } from "../../store/hooks";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { User } from "lucide-react";

const HomePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { t } = useTranslation(['dashboard', 'common']);

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard:title')}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t('dashboard:welcome')}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">
                {t('common:navigation.user')}
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {t('user:profile.username')}:
                  </p>
                  <p className="text-lg font-semibold dark:text-white">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('user:profile.email')}:</p>
                  <p className="text-sm text-gray-900 dark:text-gray-200">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ID:</p>
                  <p className="text-sm text-gray-900 dark:text-gray-200">{user?.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">{t('dashboard:quickActions.title')}</CardTitle>
              <CardDescription className="dark:text-gray-400">
                {t('dashboard:overview')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm dark:text-gray-300">
                <li>• {t('user:profile.personalInfo')}</li>
                <li>• {t('user:notifications.notificationSettings')}</li>
                <li>• {t('dashboard:stats.totalProjects')}</li>
                <li>• {t('user:preferences.interface')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">{t('dashboard:stats.activeProjects')}</CardTitle>
              <CardDescription className="dark:text-gray-400">{t('common:status.active')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm dark:text-gray-300">GraphQL API</span>
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                    {t('common:status.active')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm dark:text-gray-300">Socket.IO</span>
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                    {t('common:status.active')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm dark:text-gray-300">Database</span>
                  <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                    {t('common:status.active')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
