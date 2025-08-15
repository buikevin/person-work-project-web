import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Eye, Lock } from 'lucide-react';

export const PreferencesSettings: React.FC = () => {
  const { t, i18n } = useTranslation(['user']);
  const { isDarkMode, setDarkMode } = useTheme();

  // Language options
  const languageOptions = [
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'en', label: 'English' }
  ];

  // Handle dark mode toggle
  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
  };

  // Handle language change
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="space-y-6">
      {/* Interface Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('user:preferences.interface')}</CardTitle>
          <CardDescription>{t('user:preferences.interfaceDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t('user:preferences.darkMode')}</p>
              <p className="text-sm text-gray-500">
                {t('user:preferences.darkModeDesc')}
              </p>
            </div>
            <Switch 
              checked={isDarkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('user:preferences.language')}</Label>
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('user:preferences.privacy')}</CardTitle>
          <CardDescription>
            {t('user:preferences.privacyDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{t('user:preferences.showOnlineStatus')}</p>
                <p className="text-sm text-gray-500">
                  {t('user:preferences.showOnlineStatusDesc')}
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{t('user:preferences.publicProfile')}</p>
                <p className="text-sm text-gray-500">
                  {t('user:preferences.publicProfileDesc')}
                </p>
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
