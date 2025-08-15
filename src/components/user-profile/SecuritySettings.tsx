import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';

export const SecuritySettings: React.FC = () => {
  const { t } = useTranslation(['user']);

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>{t('user:security.password')}</CardTitle>
          <CardDescription>
            {t('user:security.passwordDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{t('user:security.currentPassword')}</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{t('user:security.newPassword')}</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t('user:security.confirmPassword')}</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>{t('user:security.changePassword')}</Button>
        </CardContent>
      </Card>

      {/* Two Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>{t('user:security.twoFactor')}</CardTitle>
          <CardDescription>
            {t('user:security.twoFactorDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{t('user:security.twoFactorStatus')}</p>
              <p className="text-sm text-gray-500">{t('user:security.notActivated')}</p>
            </div>
            <Button variant="outline">{t('user:security.activate')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
