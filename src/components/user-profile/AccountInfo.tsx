import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, Calendar, Shield } from 'lucide-react';
import moment from 'moment';

interface AccountInfoProps {
  user: any;
}

export const AccountInfo: React.FC<AccountInfoProps> = ({ user }) => {
  const { t } = useTranslation(['user']);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('user:profile.accountInfo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{t('user:profile.accountId')}</p>
                <p className="text-sm text-gray-500">{user?.id || user?._id}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{t('user:profile.accountCreated')}</p>
                <p className="text-sm text-gray-500">
                  {user?.createdAt ? moment(user.createdAt).format('DD/MM/YYYY') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">{t('user:profile.accountStatus')}</p>
                <Badge 
                  className="mt-1" 
                  variant={user?.status === 'ACTIVE' ? 'default' : 'secondary'}
                >
                  {user?.status === 'ACTIVE' ? t('user:profile.verified') : user?.status || 'N/A'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
