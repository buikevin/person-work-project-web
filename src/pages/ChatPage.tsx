import { useState, useRef, useEffect } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useTranslation } from "react-i18next";

import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Plus,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "../lib/utils";

const ChatPage = () => {
  const { t } = useTranslation(["chat", "common"]);
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [message, setMessage] = useState("");
  const [isConversationListCollapsed, setIsConversationListCollapsed] =
    useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const conversations = [
    {
      id: 1,
      name: "Team Frontend",
      lastMessage: "Tôi vừa push code mới lên git",
      time: "10:30",
      isGroup: true,
      unreadCount: 3,
      avatar: "",
      isOnline: true,
      members: [
        { name: "Nguyễn A", avatar: "", isTyping: true },
        { name: "Trần B", avatar: "", isTyping: false },
        { name: "Lê C", avatar: "", isTyping: false },
      ],
      typingUsers: ["Nguyễn A"],
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      lastMessage: "Chúng ta họp lúc 2h chiều nhé",
      time: "9:45",
      isGroup: false,
      unreadCount: 0,
      avatar: "",
      isOnline: true,
      members: [],
      typingUsers: [],
    },
    {
      id: 3,
      name: "Design Team",
      lastMessage: "Mockup mới đã sẵn sàng",
      time: "Hôm qua",
      isGroup: true,
      unreadCount: 1,
      avatar: "",
      isOnline: false,
      members: [
        { name: "Designer 1", avatar: "", isTyping: false },
        { name: "Designer 2", avatar: "", isTyping: true },
        { name: "UX Lead", avatar: "", isTyping: false },
      ],
      typingUsers: ["Designer 2"],
    },
    {
      id: 4,
      name: "Trần Thị B",
      lastMessage: "OK, cảm ơn bạn!",
      time: "Hôm qua",
      isGroup: false,
      unreadCount: 0,
      avatar: "",
      isOnline: false,
      members: [],
      typingUsers: [],
    },
  ];

  const messages = [
    {
      id: 1,
      senderId: "other",
      senderName: "Nguyễn Văn A",
      content: "Chào mọi người, có ai đang online không?",
      time: "09:30",
      isRead: true,
    },
    {
      id: 2,
      senderId: "me",
      senderName: "Tôi",
      content: "Chào A, tôi đang ở đây",
      time: "09:32",
      isRead: true,
    },
    {
      id: 3,
      senderId: "other",
      senderName: "Trần Thị B",
      content: "Tôi cũng vừa online, có gì cần hỗ trợ không?",
      time: "09:35",
      isRead: true,
    },
    {
      id: 4,
      senderId: "me",
      senderName: "Tôi",
      content: "Tôi vừa push code mới lên git, mọi người check giúp nhé",
      time: "10:30",
      isRead: false,
    },
  ];

  const selectedConversation = conversations.find(
    (conv) => conv.id === selectedChat
  );

  const handleSendMessage = () => {
    if (message.trim()) {
      // Logic to send message
      setMessage("");
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300",
          isConversationListCollapsed ? "w-16" : "w-80"
        )}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            {!isConversationListCollapsed && (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("chat:title")}
              </h2>
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setIsConversationListCollapsed(!isConversationListCollapsed)
                }
                className="shrink-0"
              >
                {isConversationListCollapsed ? (
                  <Menu className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
              {!isConversationListCollapsed && (
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          {!isConversationListCollapsed && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder={t("chat:searchConversations")}
                className="pl-10"
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation.id)}
              className={cn(
                "border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                selectedChat === conversation.id
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "",
                isConversationListCollapsed ? "p-2" : "p-4"
              )}
            >
              <div
                className={cn(
                  "flex items-center",
                  isConversationListCollapsed ? "justify-center" : "space-x-3"
                )}
              >
                <div className="relative">
                  <Avatar
                    className={cn(
                      isConversationListCollapsed ? "h-8 w-8" : "h-12 w-12"
                    )}
                  >
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>
                      {conversation.isGroup ? "G" : conversation.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {!conversation.isGroup && conversation.isOnline && (
                    <div
                      className={cn(
                        "absolute bottom-0 right-0 bg-green-500 rounded-full border-2 border-white",
                        isConversationListCollapsed ? "w-2 h-2" : "w-3 h-3"
                      )}
                    ></div>
                  )}
                  {conversation.unreadCount > 0 &&
                    isConversationListCollapsed && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                </div>

                {!isConversationListCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate text-gray-900 dark:text-white">
                        {conversation.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {conversation.time}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {conversation.typingUsers.length > 0
                        ? `${conversation.typingUsers.join(", ")} ${t(
                            "chat:typing.isTyping"
                          )}`
                        : conversation.lastMessage}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {conversation.isGroup && (
                        <div className="flex items-center space-x-1">
                          <div className="flex -space-x-2">
                            {conversation.members
                              .slice(0, 3)
                              .map((member, index) => (
                                <Avatar
                                  key={index}
                                  className="h-5 w-5 border-2 border-white"
                                >
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback className="text-xs">
                                    {member.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            {conversation.members.length > 3 && (
                              <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                <span className="text-xs text-gray-600 dark:text-gray-300">
                                  +{conversation.members.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                            {conversation.members.length}{" "}
                            {t("chat:group.members")}
                          </span>
                        </div>
                      )}

                      {conversation.typingUsers.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div
                              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedConversation.avatar} />
                    <AvatarFallback>
                      {selectedConversation.isGroup
                        ? "G"
                        : selectedConversation.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedConversation.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedConversation.isGroup
                        ? `${selectedConversation.members.length} ${t(
                            "chat:group.members"
                          )}`
                        : selectedConversation.isOnline
                        ? t("chat:status.online")
                        : t("chat:status.offline")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end space-x-2",
                    msg.senderId === "me"
                      ? "flex-row-reverse space-x-reverse"
                      : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-xs">
                      {msg.senderId === "me" ? "T" : msg.senderName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Message bubble */}
                  <div
                    className={cn(
                      "max-w-xs lg:max-w-md px-4 py-2 rounded-lg",
                      msg.senderId === "me"
                        ? "bg-blue-600 dark:bg-blue-500 text-white rounded-br-sm"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-sm"
                    )}
                  >
                    {msg.senderId !== "me" && selectedConversation.isGroup && (
                      <p className="text-xs font-medium mb-1 opacity-75">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        msg.senderId === "me"
                          ? "text-blue-100 dark:text-blue-200"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="mb-4 relative" ref={emojiPickerRef}>
                  <div className="absolute bottom-0 right-0 z-50">
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      width={300}
                      height={400}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder={t("chat:form.messagePlaceholder")}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={cn(
                      "absolute right-1 top-1/2 transform -translate-y-1/2",
                      showEmojiPicker && "bg-gray-100 dark:bg-gray-700"
                    )}
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-800">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-2">
                💬
              </div>
              <p>{t("chat:empty.selectChat")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
