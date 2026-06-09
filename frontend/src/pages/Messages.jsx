import { useState, useEffect } from "react";
import { MessageSquare, Sparkles, Monitor, Smile, Paperclip, Send, Mic, MoreVertical, Phone, ArrowLeft } from "lucide-react";
import { getUsers } from "../services/userService";
import { useAuth } from "../context/AuthContext";

const Messages = () => {
  const { user: currentUser } = useAuth();
  const [activeChat, setActiveChat] = useState("teams");
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [chatMessages, setChatMessages] = useState({});
  const [showList, setShowList] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers();
        // Filter out the current user
        setUsers(fetchedUsers.filter(u => u._id !== currentUser?._id));
      } catch (err) {
        console.error("Failed to fetch users for messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  // Format users into chat objects
  const teamChats = users.map(u => ({
    id: u._id,
    name: u.name,
    avatar: u.avatar || "https://i.pravatar.cc/150",
    role: u.role || "Team Member",
    lastMessage: "No recent messages",
    time: "",
    unread: 0,
    online: Math.random() > 0.5,
    messages: []
  }));

  const aiChats = [
    {
      id: "ai-mentor",
      name: "MentorMind AI",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=mentor",
      role: "AI Consultant",
      lastMessage: "How can I help you today?",
      time: "Now",
      unread: 1,
      online: true,
      messages: [
        { id: 1, text: "Hello! I am your MentorMind AI assistant. How can I help you manage your projects today?", sender: "ai", time: "10:00 AM" }
      ]
    }
  ];

  const currentChats = activeChat === "teams" ? teamChats : aiChats;
  const currentChatData = currentChats.find(c => c.id === selectedChatId) || (selectedChatId === null && currentChats.length > 0 ? currentChats[0] : null);

  useEffect(() => {
    if (currentChatData && selectedChatId === null) {
        setSelectedChatId(currentChatData.id);
    }
  }, [currentChatData, selectedChatId]);

  const handleSendMessage = () => {
    if (message.trim() && currentChatData) {
      const newMessage = {
        id: Date.now(),
        text: message,
        sender: "me",
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), newMessage]
      }));
      
      setMessage("");

      // Mock AI response if in AI chat
      if (activeChat === "ai") {
          setTimeout(() => {
            const aiResponse = {
                id: Date.now() + 1,
                text: "I've received your message. I'm processing your request regarding: " + message,
                sender: "ai",
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            };
            setChatMessages(prev => ({
                ...prev,
                [currentChatId]: [...(prev[currentChatId] || []), aiResponse]
            }));
          }, 1000);
      }
    }
  };

  const currentChatId = currentChatData?.id;

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
    if (window.innerWidth < 768) {
      setShowList(false);
    }
  };

  if (loading) {
     return <div className="min-h-screen flex items-center justify-center bg-indigo-900 text-white">Loading chats...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-purple-500/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 animate-pulse delay-700" />
      </div>

      {/* Main Container */}
      <div className="relative h-screen p-4">
        <div className="h-full flex bg-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20">
          {/* Left Sidebar - Chat List */}
          <div className={`w-full md:w-96 flex flex-col border-r border-white/10 bg-gradient-to-b from-black/30 to-transparent ${!showList ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="p-5 border-b border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/40 transform hover:scale-110 transition-transform cursor-pointer">
                  <MessageSquare className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Messages</h1>
                  <p className="text-white/60 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Online now
                  </p>
                </div>
              </div>
              
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/20 transition-all"
                />
              </div>
            </div>

            {/* Chat Type Tabs */}
            <div className="px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-2 p-1.5 bg-white/10 rounded-2xl">
                <button
                  onClick={() => setActiveChat("teams")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeChat === "teams" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/30" : "text-white/60 hover:text-white hover:bg-white/10"}`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Team
                </button>
                <button
                  onClick={() => setActiveChat("ai")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${activeChat === "ai" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/30" : "text-white/60 hover:text-white hover:bg-white/10"}`}
                >
                  <Sparkles className="w-4 h-4" />
                  AI
                </button>
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {currentChats.filter(chat => chat.name.toLowerCase().includes(searchTerm.toLowerCase())).map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`flex items-center gap-4 p-4 cursor-pointer transition-all border-b border-white/5 ${selectedChatId === chat.id ? "bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-l-4 border-l-pink-500" : "hover:bg-white/5"}`}
                >
                  <div className="relative">
                    <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
                    {chat.online && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-gray-900 flex items-center justify-center">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-white truncate">{chat.name}</h4>
                      <span className="text-xs text-white/50">{chat.time}</span>
                    </div>
                    <p className="text-sm text-white/60 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
                      {chat.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Chat Window */}
          <div className={`flex-1 flex flex-col bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 ${showList ? 'hidden md:flex' : 'flex'}`}>
            {currentChatData ? (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setShowList(true)} className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <ArrowLeft className="w-5 h-5 text-white" />
                      </button>
                      <div className="relative">
                        <img src={currentChatData.avatar} alt="" className="w-12 h-12 rounded-2xl shadow-lg" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{currentChatData.name}</h3>
                        <p className="text-sm text-white/50 flex items-center gap-2">
                          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                          {currentChatData.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 rounded-xl transition-all border border-pink-500/30 group">
                        <Monitor className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
                      </button>
                      <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                        <Phone className="w-5 h-5 text-white/70" />
                      </button>
                      <button className="p-3 hover:bg-white/10 rounded-xl transition-colors">
                        <MoreVertical className="w-5 h-5 text-white/70" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {[...(currentChatData.messages || []), ...(chatMessages[currentChatData.id] || [])].map((msg, index) => (
                    <div key={msg.id || index} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] rounded-3xl px-5 py-3 shadow-lg ${msg.sender === "me" ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-md" : "bg-white/10 text-white rounded-bl-md border border-white/10"}`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <div className={`flex items-center justify-end gap-1 mt-2 ${msg.sender === "me" ? "text-white/70" : "text-white/40"}`}>
                          <span className="text-[10px]">{msg.time}</span>
                          {msg.sender === "me" && <span className="text-[10px]">✓✓</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="px-6 py-4 border-t border-white/10 bg-white/5 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <button className="p-3 hover:bg-white/10 rounded-xl transition-colors">
                      <Smile className="w-6 h-6 text-white/70" />
                    </button>
                    <button className="p-3 hover:bg-white/10 rounded-xl transition-colors">
                      <Paperclip className="w-6 h-6 text-white/70" />
                    </button>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="Type a message..."
                        className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/15 transition-all"
                      />
                    </div>
                    {message.trim() ? (
                      <button onClick={handleSendMessage} className="p-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-2xl transition-all shadow-lg shadow-purple-500/30 transform hover:scale-105">
                        <Send className="w-5 h-5 text-white" />
                      </button>
                    ) : (
                      <button onClick={() => setIsRecording(!isRecording)} className={`p-4 rounded-2xl transition-all shadow-lg transform hover:scale-105 ${isRecording ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" : "bg-white/10 hover:bg-white/20"}`}>
                        <Mic className={`w-5 h-5 ${isRecording ? "text-white" : "text-white/70"}`} />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-28 h-28 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-indigo-500/30 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <MessageSquare className="w-14 h-14 text-white/80" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">Welcome to Messages</h2>
                <p className="text-white/50 text-center max-w-md">
                  Select a conversation from the sidebar to start chatting with your team
                </p>
                <div className="flex items-center gap-8 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{teamChats.length}</div>
                    <div className="text-sm text-white/50">Conversations</div>
                  </div>
                  <div className="w-px h-12 bg-white/20"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{teamChats.filter(c => c.online).length}</div>
                    <div className="text-sm text-white/50">Online Now</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
