import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { FormData, FormErrors } from '../../hooks/useProfileForm';

interface ProfileFormProps {
  formData: FormData;
  formErrors: FormErrors;
  isSaving: boolean;
  user: any;
  onInputChange: (field: keyof FormData, value: string) => void;
  onSave: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  formErrors,
  isSaving,
  user,
  onInputChange,
  onSave
}) => {
  const { t } = useTranslation(['user', 'common']);

  return (
    <div className="space-y-6">
      {/* Form fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="username">{t('user:profile.username')}</Label>
          <Input
            id="username"
            defaultValue={user?.username || ""}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500">Username không thể thay đổi</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">{t('user:profile.email')} *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            className={cn(formErrors.email && "border-red-500")}
            placeholder="example@email.com"
          />
          {formErrors.email && (
            <p className="text-sm text-red-500">{formErrors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fullName">{t('user:profile.fullname')} *</Label>
          <Input 
            id="fullName" 
            placeholder={t('user:profile.fullnamePlaceholder')}
            value={formData.fullName}
            onChange={(e) => onInputChange('fullName', e.target.value)}
            className={cn(formErrors.fullName && "border-red-500")}
          />
          {formErrors.fullName && (
            <p className="text-sm text-red-500">{formErrors.fullName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">{t('user:profile.phone')}</Label>
          <Input 
            id="phoneNumber" 
            placeholder={t('user:profile.phonePlaceholder')}
            value={formData.phoneNumber}
            onChange={(e) => onInputChange('phoneNumber', e.target.value)}
            className={cn(formErrors.phoneNumber && "border-red-500")}
          />
          {formErrors.phoneNumber && (
            <p className="text-sm text-red-500">{formErrors.phoneNumber}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">{t('user:profile.address')}</Label>
          <Input 
            id="address" 
            placeholder={t('user:profile.addressPlaceholder')}
            value={formData.address}
            onChange={(e) => onInputChange('address', e.target.value)}
            className={cn(formErrors.address && "border-red-500")}
          />
          {formErrors.address && (
            <p className="text-sm text-red-500">{formErrors.address}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">{t('user:profile.birthday')}</Label>
          <Input
            id="dateOfBirth"
            type="text"
            placeholder="DD/MM/YYYY"
            value={formData.dateOfBirth}
            onChange={(e) => onInputChange('dateOfBirth', e.target.value)}
            className={cn(formErrors.dateOfBirth && "border-red-500")}
          />
          {formErrors.dateOfBirth && (
            <p className="text-sm text-red-500">{formErrors.dateOfBirth}</p>
          )}
          <p className="text-xs text-gray-500">Định dạng: Ngày/Tháng/Năm (VD: 15/03/1990)</p>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            t('user:profile.saveChanges')
          )}
        </Button>
      </div>
    </div>
  );
};
