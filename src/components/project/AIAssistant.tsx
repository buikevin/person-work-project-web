
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Get chat history
  const {
    data: chatData,
    loading: chatLoading,
    refetch: refetchChats,
  } = useQuery(GET_CHATS_BY_USER_AND_PROJECT_QUERY, {
    variables: {
      userId,
      projectId: project._id,
    },
    fetchPolicy: 'cache-and-network',
  });

  // Create chat mutation
  const [createChat, { loading: sendingMessage }] = useMutation(CREATE_CHAT_MUTATION, {
    onCompleted: () => {
      setMessage('');
      refetchChats();
    },
    onError: (error) => {
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

  const chats: ChatMessage[] = chatData?.chatsByUserAndProject || [];

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

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [chats]);

  const handleSendMessage = async () => {
    if (!message.trim() || sendingMessage) return;

    try {
      await createChat({
        variables: {
          createChatInput: {
            message: message.trim(),
            userId,
            projectId: project._id,
          } as CreateChatInput,
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-blue-500" />
          <h3 className="font-medium text-sm text-gray-900 dark:text-white">
            AI Assistant
          </h3>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-3">
        <div className="space-y-3">
          {chatLoading ? (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t('common:loading', 'Đang tải...')}
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              {t('projects:chat.noMessages', 'Chưa có tin nhắn nào')}
            </div>
          ) : (
            chats.map((chat, index) => (
              <div key={index} className="space-y-2">
                {/* User Message */}
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 max-w-[80%]">
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                      {chat.message}
                    </p>
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

                {/* Loading state for pending response */}
                {chat.status === 'pending' && !chat.response && (
                  <div className="flex items-start gap-2">
                    <Bot className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                      <div className="flex items-center gap-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          AI đang suy nghĩ...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex items-center gap-2">
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
            disabled={!message.trim() || sendingMessage}
            size="sm"
            className="px-3"
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
