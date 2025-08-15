import { useState, useRef, useEffect } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  Paperclip, 
  Type, 
  Smile,
  MoreHorizontal,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  FileImage,
  Link
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface ComposeEmailProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComposeEmail = ({ isOpen, onClose }: ComposeEmailProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    body: ''
  });
  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFormatting, setShowFormatting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if email is ready to send
  const hasValidEmail = emailData.to.trim() && emailData.to.includes('@');
  const hasContent = emailData.subject.trim() || emailData.body.trim();
  const canSend = hasValidEmail && hasContent;

  // Debug logging
  console.log('Debug Send Button:', {
    to: emailData.to,
    subject: emailData.subject,
    body: emailData.body,
    hasValidEmail,
    hasContent,
    canSend
  });

  const handleSend = async () => {
    if (!canSend || isSending) return;
    
    setIsSending(true);
    try {
      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Sending email:', { ...emailData, attachments });
      onClose();
      // Reset form
      setEmailData({ to: '', cc: '', bcc: '', subject: '', body: '' });
      setAttachments([]);
    } catch (error) {
      console.error('Error sending email:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', { ...emailData, attachments });
    // Show toast notification or some feedback
  };

  const handleDiscard = () => {
    if (window.confirm('Bạn có chắc muốn hủy bỏ email này không?')) {
      setEmailData({ to: '', cc: '', bcc: '', subject: '', body: '' });
      setAttachments([]);
      onClose();
    }
  };

  const handleFileAttachment = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleEmojiClick = (emojiData: any) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = emailData.body;
      const newText = text.substring(0, start) + emojiData.emoji + text.substring(end);
      setEmailData({ ...emailData, body: newText });
      
      // Reset cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emojiData.emoji.length, start + emojiData.emoji.length);
      }, 0);
    }
    setShowEmojiPicker(false);
  };

  const insertFormat = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = emailData.body.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'text'}*`;
        break;
      case 'underline':
        formattedText = `_${selectedText || 'text'}_`;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](https://example.com)`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || 'item'}`;
        break;
      default:
        formattedText = selectedText;
    }

    const newText = emailData.body.substring(0, start) + formattedText + emailData.body.substring(end);
    setEmailData({ ...emailData, body: newText });
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-0 right-4 w-64 bg-white border border-gray-300 rounded-t-lg shadow-lg z-50">
        <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
          <h3 className="font-medium text-sm truncate">Soạn thư mới</h3>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(false)}
              className="h-6 w-6"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "fixed z-50 bg-white rounded-lg shadow-xl",
        isMaximized 
          ? "inset-4" 
          : "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[600px]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <h2 className="text-sm font-medium">Soạn thư mới</h2>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(true)}
              className="h-6 w-6"
            >
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMaximized(!isMaximized)}
              className="h-6 w-6"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Email Form */}
        <div className="flex flex-col h-full">
          <div className="p-4 space-y-3 border-b">
            {/* To Field */}
            <div className="flex items-center space-x-2">
              <Label className="text-sm text-gray-600 w-12">Đến:</Label>
              <Input
                placeholder="Nhập địa chỉ email"
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                className="flex-1 border-0 shadow-none focus-visible:ring-0 p-0"
              />
              <div className="flex items-center space-x-2 text-sm">
                {!showCC && (
                  <button
                    onClick={() => setShowCC(true)}
                    className="text-blue-600 hover:underline"
                  >
                    CC
                  </button>
                )}
                {!showBCC && (
                  <button
                    onClick={() => setShowBCC(true)}
                    className="text-blue-600 hover:underline"
                  >
                    BCC
                  </button>
                )}
              </div>
            </div>

            {/* CC Field */}
            {showCC && (
              <div className="flex items-center space-x-2">
                <Label className="text-sm text-gray-600 w-12">CC:</Label>
                <Input
                  placeholder="Nhập địa chỉ email"
                  value={emailData.cc}
                  onChange={(e) => setEmailData({ ...emailData, cc: e.target.value })}
                  className="flex-1 border-0 shadow-none focus-visible:ring-0 p-0"
                />
              </div>
            )}

            {/* BCC Field */}
            {showBCC && (
              <div className="flex items-center space-x-2">
                <Label className="text-sm text-gray-600 w-12">BCC:</Label>
                <Input
                  placeholder="Nhập địa chỉ email"
                  value={emailData.bcc}
                  onChange={(e) => setEmailData({ ...emailData, bcc: e.target.value })}
                  className="flex-1 border-0 shadow-none focus-visible:ring-0 p-0"
                />
              </div>
            )}

            {/* Subject Field */}
            <div className="flex items-center space-x-2">
              <Label className="text-sm text-gray-600 w-12">Chủ đề:</Label>
              <Input
                placeholder="Nhập chủ đề"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                className="flex-1 border-0 shadow-none focus-visible:ring-0 p-0"
              />
            </div>

            {/* Attachments */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded px-2 py-1 text-sm">
                    <FileImage className="h-3 w-3" />
                    <span className="truncate max-w-32">{file.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttachment(index)}
                      className="h-4 w-4 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formatting Toolbar */}
          {showFormatting && (
            <div className="p-2 border-b bg-gray-50">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" onClick={() => insertFormat('bold')}>
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => insertFormat('italic')}>
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => insertFormat('underline')}>
                  <Underline className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <Button variant="ghost" size="icon" onClick={() => insertFormat('list')}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => insertFormat('link')}>
                  <Link className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Email Body */}
          <div className="flex-1 p-4 relative">
            <Textarea
              ref={textareaRef}
              placeholder="Soạn email của bạn..."
              value={emailData.body}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              className="w-full h-full min-h-[200px] border-0 shadow-none focus-visible:ring-0 resize-none"
            />

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div ref={emojiPickerRef} className="absolute bottom-4 right-4 z-10">
                <EmojiPicker 
                  onEmojiClick={handleEmojiClick}
                  width={300}
                  height={400}
                />
              </div>
            )}
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between p-4 border-t bg-gray-50 rounded-b-lg">
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSend}
                disabled={!canSend || isSending}
                className={cn(
                  canSend ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300",
                  isSending && "opacity-50 cursor-not-allowed"
                )}
                title={
                  !hasValidEmail ? "Vui lòng nhập email người nhận hợp lệ" :
                  !hasContent ? "Vui lòng nhập chủ đề hoặc nội dung email" :
                  "Gửi email"
                }
              >
                <Send className="h-4 w-4 mr-2" />
                {isSending ? 'Đang gửi...' : 'Gửi'}
              </Button>
              
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowFormatting(!showFormatting)}
                  className={cn(showFormatting && "bg-gray-200")}
                  title="Định dạng text"
                >
                  <Type className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleFileAttachment}
                  title="Đính kèm file"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={cn(showEmojiPicker && "bg-gray-200")}
                  title="Chèn emoji"
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Thêm tùy chọn">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleSaveDraft}>
                Lưu bản nháp
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDiscard}>
                Hủy bỏ
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>
    </>
  );
};
