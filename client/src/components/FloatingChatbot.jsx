import { useState, useEffect, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { chatWithBot } from '../utils/api';

const renderMarkdown = (text) => {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  const lines = html.split('\n');
  let inList = false;
  let processedLines = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        processedLines.push('<ul style="margin-left: 15px; margin-bottom: 6px;">');
        inList = true;
      }
      processedLines.push(`<li style="margin-bottom: 2px;">${trimmed.substring(2)}</li>`);
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(line);
    }
  });
  
  if (inList) {
    processedLines.push('</ul>');
  }
  
  return processedLines.join('\n').replace(/\n/g, '<br />');
};

export default function FloatingChatbot() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi! 🌿 I am **AgriBot**. How can I help you with your crops or soil today?',
      createdAt: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Hide the floating widget on /chat page, /auth page, or when user is not logged in
  if (!user || location.pathname === '/chat' || location.pathname === '/auth') {
    return null;
  }

  const handleSendMessage = async () => {
    const query = inputValue.trim();
    if (!query) return;

    setInputValue('');
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const chatHistory = messages.map(msg => ({
        sender: msg.sender,
        text: msg.text
      }));

      const res = await chatWithBot({ message: query, history: chatHistory });
      
      if (res.data && res.data.success) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: res.data.data.text,
          createdAt: new Date()
        }]);
      } else {
        throw new Error(res.data?.message || 'Failed to reply');
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'Failed to connect. Make sure your server is running.';
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: `⚠️ **Error**: ${errMsg}`,
        createdAt: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button 
        className="floating-chat-trigger" 
        onClick={() => setIsOpen(prev => !prev)}
        title="Chat with AgriBot"
      >
        {isOpen ? '❌' : '💬'}
      </button>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="floating-chat-window">
          
          {/* Header */}
          <div className="floating-chat-header">
            <div className="floating-chat-title">
              <span>🤖</span> AgriBot Assistant
            </div>
            <button className="floating-chat-close" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Messages Feed */}
          <div className="floating-chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                {msg.sender === 'bot' && (
                  <div className="chat-message-avatar" style={{ width: 28, height: 28, fontSize: '1rem', marginRight: 8 }}>🤖</div>
                )}
                <div className="chat-message-bubble">
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                  <div style={{ fontSize: '0.65rem', opacity: 0.5, textAlign: 'right', marginTop: '4px' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="chat-message-row bot">
                <div className="chat-message-avatar" style={{ width: 28, height: 28, fontSize: '1rem', marginRight: 8 }}>🤖</div>
                <div className="typing-indicator" style={{ padding: '8px 14px' }}>
                  <div className="typing-dot" style={{ width: 6, height: 6 }} />
                  <div className="typing-dot" style={{ width: 6, height: 6 }} />
                  <div className="typing-dot" style={{ width: 6, height: 6 }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer Input Area */}
          <div className="floating-chat-input-area">
            <input
              type="text"
              className="chat-input-field"
              placeholder="Type message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
            <button 
              className="btn btn-primary" 
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
            >
              ➔
            </button>
          </div>

        </div>
      )}
    </>
  );
}
