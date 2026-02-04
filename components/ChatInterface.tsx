import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { ChatMessage, UserProfile, Language } from '../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, image?: string) => void;
  isLoading: boolean;
  texts: any;
  profile: UserProfile;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isLoading, 
  texts,
  profile 
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() || selectedImage) {
      onSendMessage(inputText, selectedImage || undefined);
      setInputText('');
      setSelectedImage(null);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        // Strip the data:image/jpeg;base64, prefix for consistent handling
        const base64 = result.split(',')[1];
        setSelectedImage(base64);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
            <h3 className="font-bold text-slate-800 dark:text-white">{texts.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{texts.subtitle}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
            <div className="text-center p-6 mt-10 opacity-60">
                <Bot className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">{texts.welcome}</p>
            </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none'
              }`}
            >
              {/* Display Image if exists */}
              {msg.image && (
                <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                    <img 
                        src={`data:image/jpeg;base64,${msg.image}`} 
                        alt="User upload" 
                        className="max-h-48 w-auto object-cover" 
                    />
                </div>
              )}

              {msg.role === 'model' ? (
                <div className="prose prose-sm max-w-none prose-slate dark:prose-invert">
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.text}
                   </ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
              <div className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-slate-400' : 'text-slate-400'} text-right opacity-70`}>
                  {msg.role === 'user' ? texts.you : texts.pharmacist} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{texts.typing}</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 relative">
        {/* Image Preview Overlay */}
        {selectedImage && (
            <div className="absolute bottom-20 left-4 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-fade-in flex flex-col items-center">
                <div className="relative">
                    <img 
                        src={`data:image/jpeg;base64,${selectedImage}`} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-lg" 
                    />
                    <button 
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-2 -right-2 bg-slate-900 text-white p-1 rounded-full shadow hover:bg-red-500 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Attached</span>
            </div>
        )}

        <div className="flex gap-2 items-center">
          <input 
             type="file" 
             ref={fileInputRef}
             accept="image/*" 
             className="hidden" 
             onChange={handleImageSelect}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-xl transition-all"
          >
             <ImageIcon className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={texts.placeholder}
            disabled={isLoading}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-white transition-all placeholder-slate-400 dark:placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={(!inputText.trim() && !selectedImage) || isLoading}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;