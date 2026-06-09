import { MessageSquare, Bot } from "lucide-react";

const MessagesHeader = ({ activeChat, setActiveChat }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-full">
      <button
        onClick={() => setActiveChat("teams")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          activeChat === "teams"
            ? "bg-[#00a884] text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        <MessageSquare className="w-4 h-4" />
        Team
      </button>
      <button
        onClick={() => setActiveChat("ai")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          activeChat === "ai"
            ? "bg-[#00a884] text-white shadow-sm"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
        }`}
      >
        <Bot className="w-4 h-4" />
        AI
      </button>
    </div>
  );
};

export default MessagesHeader;
