import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks';
import { useUpdateUser } from './useUpdateUser';
import { toast } from 'sonner';
import moment from 'moment';

export interface FormData {
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
}

export interface FormErrors {
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
}

export const useProfileForm = () => {
  const { t } = useTranslation(['user', 'common']);
  const { user } = useAppSelector((state) => state.auth);
  const { updateUserData, loading: isUpdating } = useUpdateUser();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
    dateOfBirth: "",
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form với dữ liệu user khi user được load
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth).format('DD/MM/YYYY') : "",
      });
      console.log('📝 Form được khởi tạo với dữ liệu user:', {
        fullName: user.fullName,
        email: user.email,
        dateOfBirth: user.dateOfBirth ? moment(user.dateOfBirth).format('DD/MM/YYYY') : 'Chưa có'
      });
    }
  }, [user]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = t('common:validation.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = t('common:validation.invalidEmail');
    }

    // Phone validation
    if (formData.phoneNumber && !/^[0-9+\-\s()]+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = t('common:validation.invalidPhone');
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.fullName = t('common:validation.required');
    }

    // Date validation
    if (formData.dateOfBirth && !moment(formData.dateOfBirth, 'DD/MM/YYYY', true).isValid()) {
      errors.dateOfBirth = 'Định dạng ngày không hợp lệ (DD/MM/YYYY)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Auto format date input DD/MM/YYYY
  const formatDateInput = (value: string): string => {
    // Chỉ giữ lại số
    const numbersOnly = value.replace(/\D/g, '');

    // Thêm dấu "/" tự động
    if (numbersOnly.length <= 2) {
      return numbersOnly;
    } else if (numbersOnly.length <= 4) {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2)}`;
    } else {
      return `${numbersOnly.slice(0, 2)}/${numbersOnly.slice(2, 4)}/${numbersOnly.slice(4, 8)}`;
    }
  };

  // Handle input change
  const handleInputChange = (field: keyof FormData, value: string) => {
    let processedValue = value;

    // Auto format cho field dateOfBirth
    if (field === 'dateOfBirth') {
      processedValue = formatDateInput(value);
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));

    // Clear error khi user bắt đầu nhập
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle form submission
  const handleSaveChanges = async () => {
    console.log('🚀 Bắt đầu lưu thông tin user...');
    
    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin đã nhập');
      return;
    }

    setIsSaving(true);
    try {
      if (!user?.id) {
        throw new Error('Không tìm thấy ID người dùng');
      }

      console.log('📝 Dữ liệu chuẩn bị cập nhật:', formData);

      // Chuyển đổi ngày từ DD/MM/YYYY sang ISO format để gửi API
      const dateOfBirthISO = formData.dateOfBirth
        ? moment(formData.dateOfBirth, 'DD/MM/YYYY').toISOString()
        : undefined;

      const updateUserInput = {
        id: user.id,
        email: formData.email,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        dateOfBirth: dateOfBirthISO
      };

      console.log('📅 Ngày sinh được chuyển đổi:', {
        input: formData.dateOfBirth,
        output: dateOfBirthISO
      });

      const result = await updateUserData(updateUserInput);

      if (result.success) {
        console.log('✅ Cập nhật thành công!');
        toast.success('Cập nhật thông tin thành công!', {
          description: 'Thông tin cá nhân của bạn đã được lưu.'
        });
      } else {
        console.error('❌ Cập nhật thất bại:', result.error);
        const errorMessage = typeof result.error === 'string' 
          ? result.error 
          : result.error?.message || 'Có lỗi xảy ra khi cập nhật thông tin';
        toast.error('Cập nhật thất bại', {
          description: errorMessage
        });
      }
    } catch (error) {
      console.error('❌ Lỗi không mong muốn:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Có lỗi xảy ra khi lưu thông tin';
      toast.error('Có lỗi xảy ra', {
        description: errorMessage
      });
    } finally {
      setIsSaving(false);
      console.log('🏁 Kết thúc quá trình lưu');
    }
  };

  return {
    formData,
    formErrors,
    isSaving: isSaving || isUpdating,
    handleInputChange,
    handleSaveChanges,
    user
  };
};
