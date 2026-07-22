import { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { chatWithBot, getDiagnosisHistory, getSoilHistory } from '../utils/api';
import { toast } from 'react-toastify';

// Helper function to parse basic markdown details returned by Gemini
const renderMarkdown = (text) => {
  if (!text) return '';
  
  // Basic HTML Escaping
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic: *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Handle lists
  const lines = html.split('\n');
  let inList = false;
  let processedLines = [];
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) {
        processedLines.push('<ul style="margin-left: 20px; margin-bottom: 8px;">');
        inList = true;
      }
      processedLines.push(`<li style="margin-bottom: 4px;">${trimmed.substring(2)}</li>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      // Numbered lists
      if (!inList) {
        processedLines.push('<ol style="margin-left: 20px; margin-bottom: 8px;">');
        inList = true;
      }
      const itemContent = trimmed.replace(/^\d+\.\s/, '');
      processedLines.push(`<li style="margin-bottom: 4px;">${itemContent}</li>`);
    } else {
      if (inList) {
        // Close list tags
        if (processedLines[processedLines.length - 1].includes('<li>')) {
          processedLines.push(processedLines[processedLines.length - 1].startsWith('<li>') ? '</ul>' : '</ol>');
        } else {
          processedLines.push('</ul>');
        }
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

const SUGGESTIONS = [
  { text: '🌿 How can I prevent Early Blight in my tomatoes?', query: 'How can I prevent Early Blight in my tomatoes?' },
  { text: '🛰️ Review my recent soil predictions.', query: 'Can you summarize my recent soil predictions and tell me if they are healthy?' },
  { text: '🌦️ How does rainfall affect fertilizer application?', query: 'How does heavy rainfall affect when and how I apply fertilizers?' },
  { text: '📋 Show my recent diagnoses.', query: 'What crop diseases have I diagnosed recently?' },
  { text: '🌾 What are the benefits of Neem-coated Urea?', query: 'What are the benefits of using Neem-coated Urea instead of regular chemical Urea?' }
];

export default function Chat() {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Hello ${user?.name || 'Farmer'}! 🌾 I am **AgriBot**, your agricultural intelligence assistant. I have loaded your recent farm diagnoses and soil dashboards. Ask me anything about crop diseases, organic remedies, soil nutrients, or fertilizer scheduling!`,
      createdAt: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({ diagnosesCount: 0, predictionsCount: 0 });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch stats to display in sidebar
    async function loadStats() {
      try {
        const diagRes = await getDiagnosisHistory();
        const soilRes = await getSoilHistory();
        setStats({
          diagnosesCount: diagRes.data?.data?.length || 0,
          predictionsCount: soilRes.data?.data?.length || 0
        });
      } catch (err) {
        console.warn('Failed to load history stats:', err);
      }
    }
    loadStats();
  }, []);

  useEffect(() => {
    // Auto scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputValue.trim();
    if (!query) return;

    if (!textToSend) {
      setInputValue('');
    }

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Map existing messages to history payload expected by server
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
        throw new Error(res.data?.message || 'Failed to generate response');
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || 'I had trouble connecting to the agronomy server. Please check your internet connection or try asking a simpler question.';
      toast.error('Could not connect to AgriBot. Please try again.');
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: `⚠️ **System Error**: ${errMsg}`,
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
    <div className="page-wrapper animate-fadeIn">
      <div className="container">
        
        {/* Page Header */}
        <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="page-badge">💬 AI Consultation</div>
          <h1 style={{ fontSize: '2rem' }}>AgriBot <span className="gradient-text">Chat Assistant</span></h1>
          <p>Instant precision agronomy advice, treatment plans, and soil diagnostics powered by Gemini AI.</p>
        </div>

        <div className="chat-page-container">
          
          {/* Sidebar */}
          <div className="glass-card chat-panel-sidebar">
            <div>
              <h3 style={{ marginBottom: '8px', fontSize: '1.15rem' }}>🌱 Your Farm Profile</h3>
              <p style={{ fontSize: '0.85rem' }}>AgriBot uses your active history to contextualize answers.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <div style={{ padding: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem' }}>🔬 Leaf Diagnoses</span>
                  <span className="badge badge-green" style={{ fontSize: '0.8rem' }}>{stats.diagnosesCount}</span>
                </div>
                <div style={{ padding: '12px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem' }}>🛰️ Soil Predictions</span>
                  <span className="badge badge-teal" style={{ fontSize: '0.8rem' }}>{stats.predictionsCount}</span>
                </div>
              </div>
            </div>

            <div className="divider" style={{ margin: '4px 0' }} />

            <div>
              <h3 style={{ marginBottom: '12px', fontSize: '1.15rem' }}>💡 Suggestion Prompts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    className="suggestion-chip"
                    onClick={() => handleSendMessage(s.query)}
                    disabled={isLoading}
                  >
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Chat Console */}
          <div className="glass-card chat-panel-main">
            
            {/* Messages Feed */}
            <div className="chat-messages-container">
              <AnimatePresence>
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-message-row ${msg.sender}`}>
                    {msg.sender === 'bot' && (
                      <div className="chat-message-avatar">🤖</div>
                    )}
                    <div className="chat-message-bubble">
                      <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.text) }} />
                      <div style={{ 
                        fontSize: '0.7rem', 
                        color: msg.sender === 'user' ? 'rgba(3,7,18,0.6)' : 'var(--text-muted)', 
                        textAlign: 'right', 
                        marginTop: '6px' 
                      }}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {msg.sender === 'user' && (
                      <div className="chat-message-avatar">👤</div>
                    )}
                  </div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <div className="chat-message-row bot">
                  <div className="chat-message-avatar">🤖</div>
                  <div className="typing-indicator">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Action Area */}
            <div className="chat-input-area">
              <input
                type="text"
                className="chat-input-field"
                placeholder="Ask about organic cures, soil pH, crop watering..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
              <button 
                className="btn btn-primary" 
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputValue.trim()}
                style={{ borderRadius: 'var(--radius-full)', padding: '12px 24px' }}
              >
                Send ➡️
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
