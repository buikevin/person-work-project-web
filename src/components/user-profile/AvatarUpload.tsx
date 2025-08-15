import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarUploadProps {
  user: any;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ user }) => {
  const { t } = useTranslation(['user']);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 1024 * 1024; // 1MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (file.size > maxSize) {
      toast.error('File quá lớn', {
        description: 'Kích thước file phải nhỏ hơn 1MB'
      });
      return;
    }
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Định dạng file không hợp lệ', {
        description: 'Vui lòng chọn file ảnh (JPG, PNG, GIF)'
      });
      return;
    }

    setIsUploading(true);
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setSelectedAvatar(previewUrl);
      
      toast.success('Upload ảnh thành công!');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload thất bại', {
        description: 'Có lỗi xảy ra khi upload ảnh'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={selectedAvatar} />
        <AvatarFallback className="text-lg">
          {user?.username?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <Button 
          variant="outline" 
          onClick={handleAvatarUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang upload...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {t('user:profile.changePhoto')}
            </>
          )}
        </Button>
        <p className="text-sm text-gray-500">
          JPG, PNG, GIF tối đa 1MB
        </p>
      </div>
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
