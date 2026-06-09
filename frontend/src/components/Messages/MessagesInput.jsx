import { Send, Paperclip, Image, Smile, Mic, MicOff } from "lucide-react";
import { useState } from "react";

const MessagesInput = ({ message, setMessage, onSendMessage, activeChat }) => {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="px-4 py-3 bg-[#f0f2f5] dark:bg-gray-800 border-t border-gray-200/50 dark:border-gray-700/50">
      <div className="flex items-center gap-2">
        {/* Left Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Input Field */}
        <div className="flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
            placeholder={activeChat === "ai" ? "Ask AI anything..." : "Type a message..."}
            className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Right Action - Mic or Send */}
        {message.trim() ? (
          <button
            onClick={onSendMessage}
            className="p-2.5 bg-[#00a884] hover:bg-[#008f6b] rounded-full transition-colors shadow-sm"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        ) : (
          <button 
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2.5 rounded-full transition-colors shadow-sm ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"}`}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MessagesInput;
