import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Checkbox } from "../components/ui/checkbox";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../components/ui/resizable";
import { ComposeEmail } from "../components/email/ComposeEmail";
import {
  Mail,
  Search,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Inbox,
  Send,
  FileText,
  Plus,
} from "lucide-react";
import { cn } from "../lib/utils";

const EmailPage = () => {
  const { t } = useTranslation(['email', 'common']);
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null);
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const folders = [
    { id: "inbox", name: t('email:folders.inbox'), icon: Inbox, count: 12 },
    { id: "sent", name: t('email:folders.sent'), icon: Send, count: 0 },
    { id: "drafts", name: t('email:folders.draft'), icon: FileText, count: 3 },
    { id: "archive", name: t('email:actions.archive'), icon: Archive, count: 45 },
    { id: "trash", name: t('email:folders.trash'), icon: Trash2, count: 2 },
  ];

  const emails = [
    {
      id: 1,
      from: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      subject: "Báo cáo ti��n độ dự án tuần này",
      preview: "Xin chào, tôi xin gửi báo cáo tiến độ dự án của tuần này...",
      time: "10:30 AM",
      isRead: false,
      isStarred: true,
      hasAttachment: true,
      labels: ["Công việc", "Quan trọng"],
    },
    {
      id: 2,
      from: "Trần Thị B",
      email: "tranthib@example.com",
      subject: "Meeting notes - Sprint Planning",
      preview: "Các ghi chú từ cuộc họp sprint planning hôm nay...",
      time: "9:15 AM",
      isRead: true,
      isStarred: false,
      hasAttachment: false,
      labels: ["Meeting"],
    },
    {
      id: 3,
      from: "Lê Văn C",
      email: "levanc@example.com",
      subject: "Code review request",
      preview: "Xin chào team, tôi cần code review cho feature mới...",
      time: "Hôm qua",
      isRead: false,
      isStarred: false,
      hasAttachment: true,
      labels: ["Development"],
    },
  ];

  const selectedEmailData = emails.find((email) => email.id === selectedEmail);

  const toggleEmailSelection = (emailId: number) => {
    setSelectedEmails((prev) =>
      prev.includes(emailId)
        ? prev.filter((id) => id !== emailId)
        : [...prev, emailId]
    );
  };

  const selectAllEmails = () => {
    if (selectedEmails.length === emails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emails.map((email) => email.id));
    }
  };

  const deleteSelectedEmails = () => {
    // Logic to delete selected emails
    console.log("Deleting emails:", selectedEmails);
    setSelectedEmails([]);
    setIsSelectionMode(false);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedEmails([]);
    }
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4">
              <Button
                className="w-full justify-start"
                onClick={() => setIsComposeOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
            {t('email:compose')}
              </Button>
            </div>

            <nav className="flex-1 px-2">
              {folders.map((folder) => {
                const Icon = folder.icon;
                return (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1",
                      selectedFolder === folder.id
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-3 h-4 w-4" />
                      {folder.name}
                    </div>
                    {folder.count > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {folder.count}
                      </Badge>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Email List */}
        <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
          <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input placeholder={t('email:search.placeholder')} className="pl-10" />
              </div>

              {/* Bulk Action Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={
                      selectedEmails.length === emails.length
                        ? true
                        : selectedEmails.length > 0
                        ? "indeterminate"
                        : false
                    }
                    onCheckedChange={selectAllEmails}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSelectionMode}
                    className={cn(
                      isSelectionMode && "bg-blue-100 text-blue-600"
                    )}
                  >
                    {t('email:selection.selectMultiple')}
                  </Button>
                </div>

                {selectedEmails.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {selectedEmails.length} {t('email:selection.selected')}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={deleteSelectedEmails}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {t('email:actions.delete')}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4 mr-1" />
                      {t('email:actions.archive')}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {emails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email.id)}
                  className={cn(
                    "p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                    selectedEmail === email.id ? "bg-blue-50 dark:bg-blue-900" : "",
                    !email.isRead ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedEmails.includes(email.id)}
                      onCheckedChange={() => toggleEmailSelection(email.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1"
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">
                        {email.from.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p
                          className={cn(
                            "text-sm truncate dark:text-white",
                            !email.isRead ? "font-semibold" : "font-normal"
                          )}
                        >
                          {email.from}
                        </p>
                        <div className="flex items-center space-x-1">
                          {email.isStarred && (
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          )}
                          <span className="text-xs text-gray-500">
                            {email.time}
                          </span>
                        </div>
                      </div>

                      <p
                        className={cn(
                          "text-sm truncate mt-1 dark:text-gray-200",
                          !email.isRead ? "font-medium" : "font-normal"
                        )}
                      >
                        {email.subject}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                        {email.preview}
                      </p>

                      <div className="flex items-center space-x-1 mt-2">
                        {email.labels.map((label) => (
                          <Badge
                            key={label}
                            variant="outline"
                            className="text-xs"
                          >
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Email Content */}
        <ResizablePanel defaultSize={45} minSize={30}>
          <div className="h-full flex flex-col bg-white dark:bg-gray-900">
            {selectedEmailData ? (
              <>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold dark:text-white">
                      {selectedEmailData.subject}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon">
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Archive className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mt-4">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {selectedEmailData.from.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium dark:text-white">{selectedEmailData.from}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedEmailData.email}
                      </p>
                    </div>
                    <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                      {selectedEmailData.time}
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6 bg-white dark:bg-gray-900 overflow-y-auto">
                  <div className="prose max-w-none dark:prose-invert">
                    <p>Xin chào,</p>
                    <p>
                      Tôi viết email này để cập nhật tiến độ dự án trong tuần
                      vừa qua. Chúng ta đã hoàn thành được 85% công việc theo kế
                      hoạch và đang trong giai đoạn cuối của sprint hiện tại.
                    </p>
                    <p>Một số điểm nổi bật:</p>
                    <ul>
                      <li>Hoàn thành module authentication</li>
                      <li>Tích hợp API thanh toán</li>
                      <li>Testing và bug fixes</li>
                    </ul>
                    <p>Vui lòng cho tôi biết nếu bạn có bất kỳ câu hỏi nào.</p>
                    <p>
                      Trân trọng,
                      <br />
                      {selectedEmailData.from}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                  <div className="flex space-x-2">
                    <Button>
                      <Reply className="mr-2 h-4 w-4" />
                      {t('email:actions.reply')}
                    </Button>
                    <Button variant="outline">
                      <Forward className="mr-2 h-4 w-4" />
                      {t('email:actions.forward')}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Mail className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                  <p className="mt-2">{t('email:empty.selectEmail')}</p>
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Compose Email Modal */}
      <ComposeEmail
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
      />
    </div>
  );
};

export default EmailPage;
