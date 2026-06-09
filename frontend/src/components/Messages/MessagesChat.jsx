import { Phone, Video, Search, MoreVertical } from "lucide-react";

const MessagesChat = ({ chat, activeChat }) => {
  if (!chat && activeChat !== "ai") return null;

  const currentChat = chat;

  return (
    /* Chat Header - WhatsApp Style */
    <div className="px-4 py-3 bg-[#f0f2f5] dark:bg-gray-800 border-b border-gray-200/50 dark:border-gray-700 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {activeChat === "ai" ? (
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
        ) : (
          <div className="relative">
            <img 
              src={currentChat?.avatar} 
              alt="" 
              className="w-10 h-10 rounded-full" 
            />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-white">
            {activeChat === "ai" ? "AI Assistant" : currentChat?.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {activeChat === "ai" ? "Online" : currentChat?.role}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
          <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
          <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
          <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default MessagesChat;
