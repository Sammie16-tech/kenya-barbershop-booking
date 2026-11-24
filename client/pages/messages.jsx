import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaPaperPlane, FaUserCircle, FaStore } from 'react-icons/fa';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function Messages() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  useEffect(() => {
    if (activeChat) fetchMessages(activeChat.user.id);
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/conversations`);
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/messages/${otherUserId}`);
      setMessages(res.data.messages || []);
      
      // Update unread count locally
      setConversations(prev => prev.map(c => 
        c.user.id === otherUserId ? { ...c, unreadCount: 0 } : c
      ));
    } catch (err) {
      console.error('Failed to fetch messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        receiverId: activeChat.user.id,
        content: newMessage
      });
      
      setMessages([...messages, res.data.data]);
      setNewMessage('');
      
      // Update conversation last message
      setConversations(prev => prev.map(c => 
        c.user.id === activeChat.user.id 
          ? { ...c, lastMessage: res.data.data } 
          : c
      ));
    } catch (err) {
      console.error('Failed to send message');
    }
  };

  if (!user) return <div className="p-20 text-center font-bold">Please log in to view messages.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <main className="flex-1 layout-container py-8">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex h-[700px] overflow-hidden">
          
          {/* Sidebar */}
          <div className="w-1/3 border-r border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Messages</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
              {loading ? (
                <div className="text-center py-10 text-gray-400">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm font-medium">No conversations yet.</div>
              ) : (
                conversations.map((chat) => (
                  <button
                    key={chat.user.id}
                    onClick={() => setActiveChat(chat)}
                    className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 ${
                      activeChat?.user.id === chat.user.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      {chat.user.profilePicture ? (
                        <img src={chat.user.profilePicture} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeChat?.user.id === chat.user.id ? 'bg-white/20' : 'bg-gray-100 text-gray-400'}`}>
                          {chat.user.role === 'shop_owner' ? <FaStore size={20} /> : <FaUserCircle size={24} />}
                        </div>
                      )}
                      {chat.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h4 className={`font-bold truncate ${activeChat?.user.id === chat.user.id ? 'text-white' : 'text-gray-900'}`}>
                        {chat.user.firstName} {chat.user.lastName}
                      </h4>
                      <p className={`text-xs truncate mt-0.5 ${activeChat?.user.id === chat.user.id ? 'text-blue-200' : 'text-gray-500'} ${chat.unreadCount > 0 ? 'font-bold' : ''}`}>
                        {chat.lastMessage?.content || 'Started a conversation'}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="w-2/3 flex flex-col bg-gray-50/50">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-6 bg-white border-b border-gray-100 flex items-center gap-4 shadow-sm z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    {activeChat.user.role === 'shop_owner' ? <FaStore /> : <FaUserCircle size={20} />}
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900 leading-tight">
                      {activeChat.user.firstName} {activeChat.user.lastName}
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activeChat.user.role.replace('_', ' ')}</p>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {messages.map((msg, idx) => {
                    const isMe = msg.senderId === user.id;
                    return (
                      <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[70%] p-4 rounded-2xl ${
                          isMe 
                          ? 'bg-blue-600 text-white rounded-br-sm shadow-md shadow-blue-600/20' 
                          : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm'
                        }`}>
                          <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 mt-1 px-1">
                          {dayjs(msg.createdAt).fromNow()}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
                    >
                      <FaPaperPlane />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <FaPaperPlane className="text-6xl mb-4 opacity-20" />
                <h3 className="text-xl font-black text-gray-500 mb-2">Your Messages</h3>
                <p className="text-sm font-medium text-gray-400">Select a conversation to start chatting.</p>
              </div>
            )}
          </div>

        </div>
      </main>
      
    </div>
  );
}
