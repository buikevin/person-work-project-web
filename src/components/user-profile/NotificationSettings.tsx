import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Mail, Bell, User } from 'lucide-react';

export const NotificationSettings: React.FC = () => {
  const { t } = useTranslation(['user']);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('user:notifications.notificationSettings')}</CardTitle>
        <CardDescription>
          {t('user:notifications.notificationSettingsDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{t('user:notifications.emailNotifications')}</p>
                <p className="text-sm text-gray-500">
                  {t('user:notifications.emailNotificationsDesc')}
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{t('user:notifications.pushNotifications')}</p>
                <p className="text-sm text-gray-500">
                  {t('user:notifications.pushNotificationsDesc')}
                </p>
              </div>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{t('user:notifications.accountActivity')}</p>
                <p className="text-sm text-gray-500">
                  {t('user:notifications.accountActivityDesc')}
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
