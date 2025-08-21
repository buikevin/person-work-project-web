
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Send, Bot, User, Loader2, Paperclip, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  GET_CHATS_BY_USER_AND_PROJECT_QUERY,
  CREATE_CHAT_MUTATION,
  CHAT_UPDATED_SUBSCRIPTION,
  type ChatMessage,
  type CreateChatInput,
} from '../../graphql/operations/project';
import { Project } from '../../graphql/project';

interface AIAssistantProps {
  project: Project;
  userId: string;
}

export const AIAssistant = ({ project, userId }: AIAssistantProps) => {
  const { t } = useTranslation(['projects', 'common']);
  const [message, setMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get chat history with pagination
  const {
    data: chatData,
    loading: chatLoading,
    refetch: refetchChats,
    fetchMore,
  } = useQuery(GET_CHATS_BY_USER_AND_PROJECT_QUERY, {
    variables: {
      userId,
      projectId: project._id,
      page: 1,
      limit: 50,
    },
    fetchPolicy: 'cache-and-network',
  });

  // Create chat mutation
  const [createChat] = useMutation(CREATE_CHAT_MUTATION, {
    onCompleted: (data) => {
      setMessage('');
      setSendingMessage(false);
      refetchChats();
    },
    onError: (error) => {
      setSendingMessage(false);
      toast.error('Không thể gửi tin nhắn', {
        description: error.message,
      });
    },
  });

  // Subscribe to chat updates
  useSubscription(CHAT_UPDATED_SUBSCRIPTION, {
    variables: {
      projectId: project._id,
      userId,
    },
    onSubscriptionData: () => {
      refetchChats();
    },
  });

  const chatPagination = chatData?.chatsByUserAndProjectPaginated;
  const chats: ChatMessage[] = chatPagination?.messages || [];

  // Initialize chat with project structure if no chat history
  useEffect(() => {
    if (!chatLoading && chats.length === 0 && !isInitialized && project.content) {
      const projectStructure = project.content
        .map((file) => `${file.type === 'directory' ? '📁' : '📄'} ${file.path}`)
        .join('\n');

      const initMessage = `Đây là cấu trúc dự án, hãy đọc nó và phân tích:\n\n${projectStructure}`;

      createChat({
        variables: {
          createChatInput: {
            message: initMessage,
            userId,
            projectId: project._id,
          } as CreateChatInput,
        },
      });

      setIsInitialized(true);
    }
  }, [chatLoading, chats.length, isInitialized, project.content, project._id, userId, createChat]);

  // Auto scroll to bottom when new messages arrive or component mounts
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    // Scroll to bottom after messages load or update
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [chats, sendingMessage]);

  const handleSendMessage = async () => {
    if ((!message.trim() && previewImages.length === 0) || sendingMessage) return;

    setSendingMessage(true);

    try {
      // If we have preview images, send them first
      if (previewImages.length > 0) {
        for (const imageStr of previewImages) {
          await createChat({
            variables: {
              createChatInput: {
                message: imageStr,
                userId,
                projectId: project._id,
              } as CreateChatInput,
            },
          });
        }
        // Clear preview images after sending
        setPreviewImages([]);
        setSelectedFiles([]);
      }

      // Send text message if exists
      if (message.trim()) {
        await createChat({
          variables: {
            createChatInput: {
              message: message.trim(),
              userId,
              projectId: project._id,
            } as CreateChatInput,
          },
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      if (file.size > maxSize) {
        toast.error(`File ${file.name} quá lớn`, {
          description: 'Kích thước file phải nhỏ hơn 5MB'
        });
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} không hợp lệ`, {
          description: 'Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WEBP)'
        });
        return false;
      }
      
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Create preview for images
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageData = {
            svg: e.target.result as string,
            type: 'image',
            projectId: `person-work-project-${Date.now()}`
          };
          setPreviewImages(prev => [...prev, JSON.stringify(imageData)]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removePreviewImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const parseMessageForImages = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      if (parsed.svg && parsed.type && parsed.projectId && parsed.projectId.includes('person-work-project')) {
        return parsed;
      }
    } catch (e) {
      // Not a valid JSON, return null
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-500" />
          <h3 className="font-medium text-sm text-gray-900 dark:text-white">
            AI Assistant
          </h3>
          {chatLoading && (
            <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 relative">
        <ScrollArea 
          ref={scrollAreaRef} 
          className="absolute inset-0"
        >
          <div 
            ref={scrollViewportRef}
            className="p-3"
          >
            <div className="space-y-3 pb-4">
              {chatLoading && chats.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('common:loading', 'Đang tải...')}
                  </div>
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
                  {t('projects:chat.noMessages', 'Chưa có tin nhắn nào')}
                </div>
              ) : (
                chats.map((chat, index) => (
                  <div key={index} className="space-y-2">
                    {/* User Message */}
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 max-w-[80%]">
                        {(() => {
                          const imageData = parseMessageForImages(chat.content);
                          if (imageData) {
                            return (
                              <div className="space-y-2">
                                <img 
                                  src={imageData.svg} 
                                  alt="Uploaded image" 
                                  className="max-w-full h-auto rounded border"
                                  style={{ maxHeight: '200px' }}
                                />
                                <p className="text-xs text-gray-500">Image uploaded</p>
                              </div>
                            );
                          } else {
                            return (
                              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                                {chat.content}
                              </p>
                            );
                          }
                        })()}
                        {chat.timestamp && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(chat.timestamp).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* AI Response */}
                    {chat.response && (
                      <div className="flex items-start gap-2">
                        <Bot className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 max-w-[80%]">
                          <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                            {chat.response}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Thinking state when sending message */}
              {sendingMessage && (
                <div className="flex items-start gap-2">
                  <Bot className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Message Input - Always at bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {/* Image Preview */}
        {previewImages.length > 0 && (
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap gap-2">
              {previewImages.map((imageStr, index) => {
                const imageData = parseMessageForImages(imageStr);
                return imageData ? (
                  <div key={index} className="relative group">
                    <img 
                      src={imageData.svg} 
                      alt={`Preview ${index + 1}`} 
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <button
                      onClick={() => removePreviewImage(index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}

        <div className="p-3">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleFileSelect}
              size="sm"
              variant="ghost"
              className="px-2 cursor-pointer"
              disabled={sendingMessage}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('projects:chat.placeholder', 'Nhập tin nhắn...')}
              className="flex-1 text-sm"
              disabled={sendingMessage}
            />
            <Button
              onClick={handleSendMessage}
              disabled={(!message.trim() && previewImages.length === 0) || sendingMessage}
              size="sm"
              className="px-3"
            >
              {sendingMessage ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Send className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
