import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ArrowLeft, Loader2, Github, GitBranch, FolderOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

const AddProjectPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [gitUrl, setGitUrl] = useState('');
  const [localPath, setLocalPath] = useState('');

  const handleGitImport = async () => {
    if (!gitUrl.trim()) {
      setImportError('Vui lòng nhập URL repository');
      return;
    }

    try {
      setIsImporting(true);
      setImportError(null);

      // Simulate git clone and import
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('Importing from Git:', gitUrl);
      
      // Redirect to project list
      navigate('/projects');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi import dự án';
      setImportError(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  const handleLocalImport = async () => {
    if (!localPath.trim()) {
      setImportError('Vui lòng nhập đường dẫn thư mục');
      return;
    }

    try {
      setIsImporting(true);
      setImportError(null);

      // Simulate local folder import
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Importing from local:', localPath);
      
      // Redirect to project list
      navigate('/projects');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi import dự án';
      setImportError(errorMessage);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className={cn("h-full flex flex-col bg-gray-50", isDarkMode && "dark:bg-gray-900")}>
      {/* Header */}
      <header className={cn("bg-white border-b border-gray-200 flex-shrink-0", isDarkMode && "dark:bg-gray-800 dark:border-gray-700")}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              onClick={() => navigate('/projects')}
              variant="ghost"
              size="sm"
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <h1 className={cn("text-xl font-semibold text-gray-900", isDarkMode && "dark:text-white")}>
              Thêm dự án có sẵn
            </h1>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle>Import dự án</CardTitle>
                <CardDescription>
                  Thêm dự án từ Git repository hoặc thư mục local vào workspace của bạn
                </CardDescription>
              </CardHeader>
            </Card>

            {importError && (
              <Alert variant="destructive">
                <AlertDescription>{importError}</AlertDescription>
              </Alert>
            )}

            {/* Git Import */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  Import từ Git Repository
                </CardTitle>
                <CardDescription>
                  Clone dự án từ GitHub, GitLab, Bitbucket hoặc bất kỳ Git repository nào
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gitUrl">URL Repository *</Label>
                  <Input
                    id="gitUrl"
                    type="url"
                    placeholder="https://github.com/username/repository.git"
                    value={gitUrl}
                    onChange={(e) => setGitUrl(e.target.value)}
                    disabled={isImporting}
                  />
                  <p className="text-xs text-gray-500">
                    Hỗ trợ HTTPS và SSH URLs
                  </p>
                </div>

                <Button
                  onClick={handleGitImport}
                  disabled={isImporting || !gitUrl.trim()}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang clone repository...
                    </>
                  ) : (
                    <>
                      <GitBranch className="mr-2 h-4 w-4" />
                      Clone và Import
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Local Import */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Import từ Thư mục Local
                </CardTitle>
                <CardDescription>
                  Thêm dự án từ thư mục có sẵn trên máy tính của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="localPath">Đường dẫn thư mục *</Label>
                  <Input
                    id="localPath"
                    placeholder="/Users/username/projects/my-project"
                    value={localPath}
                    onChange={(e) => setLocalPath(e.target.value)}
                    disabled={isImporting}
                  />
                  <p className="text-xs text-gray-500">
                    Đường dẫn tuyệt đối đến thư mục dự án
                  </p>
                </div>

                <Button
                  onClick={handleLocalImport}
                  disabled={isImporting || !localPath.trim()}
                  variant="outline"
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang import thư mục...
                    </>
                  ) : (
                    <>
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Import Thư mục
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lưu ý</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className={cn("text-sm text-gray-600 space-y-2", isDarkMode && "dark:text-gray-300")}>
                  <li>• Đảm bảo repository/thư mục chứa các file cấu hình cần thiết</li>
                  <li>• Dự án sẽ được copy vào workspace local</li>
                  <li>• Các dependencies sẽ được tự động cài đặt nếu có package.json</li>
                  <li>• Hỗ trợ các framework phổ biến: React, Vue, Angular, Next.js, v.v.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjectPage;
