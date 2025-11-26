import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type AIChatProps = {
  onBack: () => void;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi! I'm your AI plant care expert. I can help you with watering schedules, pest identification, placement advice, and any other plant care questions you have. What would you like to know?",
    timestamp: new Date(),
  },
];

const SAMPLE_RESPONSES = [
  "Based on your Monstera's current conditions and the fact that you last watered 3 days ago, I'd recommend waiting another 4-5 days before the next watering. The soil should be dry about 2 inches down before watering again.",
  "Your east-facing window is perfect! The morning light is gentle and won't scorch the leaves, while providing enough brightness for healthy growth. Keep your plant 3-5 feet from the window for optimal indirect light.",
  "Yellow leaves can indicate overwatering. Check if the soil is staying too moist between waterings. Also ensure your pot has drainage holes. If the yellowing is on older, lower leaves only, that's natural aging.",
  "For a Monstera, aim for soil that's moist but not soggy. Stick your finger about 2 inches into the soil - if it feels dry at that depth, it's time to water. The top inch or two should dry out between waterings.",
  "Winter care tip: Reduce watering frequency by about 25-30% as plants grow more slowly in winter. Also, watch for dry air from heating systems - consider a humidifier or pebble tray if leaves start browning at the edges.",
];

export function AIChat({ onBack }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = SAMPLE_RESPONSES[Math.floor(Math.random() * SAMPLE_RESPONSES.length)];
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h2>AI Plant Expert</h2>
            <p className="text-sm text-neutral-600">Ask me anything about plant care</p>
          </div>
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-green-600" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-neutral-100 text-neutral-900'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-neutral-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick suggestions */}
      {messages.length === 1 && (
        <div className="px-6 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setInput("How often should I water my Monstera?")}
              className="flex-shrink-0 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm transition-colors"
            >
              Watering schedule?
            </button>
            <button
              onClick={() => setInput("Is my window placement good for my plant?")}
              className="flex-shrink-0 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm transition-colors"
            >
              Check placement
            </button>
            <button
              onClick={() => setInput("Why are the leaves turning yellow?")}
              className="flex-shrink-0 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm transition-colors"
            >
              Yellow leaves?
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 pb-6 pt-4 border-t border-neutral-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about plant care..."
            className="flex-1 px-4 py-3 bg-neutral-100 rounded-full focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="rounded-full flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
