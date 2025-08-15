import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";
import { useProfileForm } from "../hooks/useProfileForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { AvatarUpload } from "../components/user-profile/AvatarUpload";
import { ProfileForm } from "../components/user-profile/ProfileForm";
import { AccountInfo } from "../components/user-profile/AccountInfo";
import { SecuritySettings } from "../components/user-profile/SecuritySettings";
import { NotificationSettings } from "../components/user-profile/NotificationSettings";
import { PreferencesSettings } from "../components/user-profile/PreferencesSettings";
import { cn } from "../lib/utils";

const UserPage = () => {
  const { t } = useTranslation(['user', 'common']);
  const { isDarkMode } = useTheme();
  
  const {
    formData,
    formErrors,
    isSaving,
    handleInputChange,
    handleSaveChanges,
    user
  } = useProfileForm();

  return (
    <div className={cn("h-full bg-gray-50 p-6 overflow-y-auto", isDarkMode && "dark:bg-gray-900")}>
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('user:header.userInfo')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('user:header.userInfoDesc')}
          </p>
        </header>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">{t('user:tabs.profile')}</TabsTrigger>
            <TabsTrigger value="security">{t('user:tabs.security')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('user:tabs.notifications')}</TabsTrigger>
            <TabsTrigger value="preferences">{t('user:tabs.preferences')}</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('user:profile.personalInfo')}</CardTitle>
                <CardDescription>
                  {t('user:profile.personalInfoDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <AvatarUpload user={user} />
                <ProfileForm
                  formData={formData}
                  formErrors={formErrors}
                  isSaving={isSaving}
                  user={user}
                  onInputChange={handleInputChange}
                  onSave={handleSaveChanges}
                />
              </CardContent>
            </Card>

            <AccountInfo user={user} />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <SecuritySettings />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettings />
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <PreferencesSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserPage;
