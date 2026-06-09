import { Search } from "lucide-react";

const MessagesList = ({ chats, selectedChat, onSelectChat, searchTerm }) => {
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto">
      {filteredChats.map((chat) => (
        <div
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`
            flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-700/50
            ${selectedChat === chat.id 
              ? "bg-[#f0f2f5] dark:bg-gray-700/50" 
              : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
            }
          `}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {chat.online && (
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#25d366] rounded-full border-2 border-white dark:border-gray-800" />
            )}
          </div>
          
          {/* Chat Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-800 dark:text-white truncate">{chat.name}</h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">{chat.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage}</p>
              {chat.unread > 0 && (
                <span className="flex-shrink-0 w-5 h-5 bg-[#25d366] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {chat.unread}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
