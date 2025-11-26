import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Camera } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { Plant } from '../App';

type AIExpertTabProps = {
  plants: Plant[];
  prefilledMessage?: string;
  setPrefilledMessage?: (message: string) => void;
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const SUGGESTED_QUESTIONS = [
  "What's wrong with my plant's leaves?",
  "How much should I water my pothos?",
  "Is my spot too dark?",
  "Why are the leaves turning yellow?",
];

const AI_RESPONSES: Record<string, string> = {
  'water': "Great question! Watering frequency depends on your plant and its location. Most houseplants prefer to dry out slightly between waterings. Stick your finger about 2 inches into the soil - if it feels dry, it's time to water. Plants in brighter spots typically need more frequent watering.",
  'light': "Light is crucial for plant health! If your plant's leaves are small, pale, or it's growing slowly, it might need more light. Try moving it closer to a window. Most common houseplants do well in bright, indirect light.",
  'yellow': "Yellow leaves can indicate several things: overwatering (most common), underwatering, or insufficient light. Check the soil moisture and your watering schedule. If the soil is constantly wet, reduce watering. If it's bone dry, increase frequency.",
  'leaves': "Leaf issues can have many causes. Brown tips often mean low humidity or mineral buildup from tap water. Yellowing can indicate overwatering. Drooping suggests underwatering. Can you describe what you're seeing in more detail?",
  'default': "I'm here to help with your plant care questions! Feel free to ask about watering, light requirements, common problems, or anything else plant-related. The more specific you are, the better I can assist you.",
};

export function AIExpertTab({ plants, prefilledMessage, setPrefilledMessage }: AIExpertTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI plant expert. Ask me anything about plant care, and I'll do my best to help keep your plants healthy and thriving!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState(prefilledMessage || '');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update input when prefilledMessage changes
  useEffect(() => {
    if (prefilledMessage) {
      setInputValue(prefilledMessage);
      // Clear the prefilled message after using it
      if (setPrefilledMessage) {
        setPrefilledMessage('');
      }
    }
  }, [prefilledMessage, setPrefilledMessage]);

  const handleSend = (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Generate AI response
    setTimeout(() => {
      const response = generateResponse(text);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('water')) return AI_RESPONSES.water;
    if (lowerQuery.includes('light') || lowerQuery.includes('dark') || lowerQuery.includes('sun')) return AI_RESPONSES.light;
    if (lowerQuery.includes('yellow')) return AI_RESPONSES.yellow;
    if (lowerQuery.includes('leaves') || lowerQuery.includes('leaf')) return AI_RESPONSES.leaves;
    
    return AI_RESPONSES.default;
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="mb-0">AI Expert</h1>
            <p className="text-sm text-neutral-600">Always here to help</p>
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
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (only show when few messages) */}
        {messages.length <= 1 && (
          <div className="mt-6">
            <p className="text-sm text-neutral-600 mb-3">Try asking:</p>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  onClick={() => handleSuggestionClick(question)}
                  className="w-full text-left px-4 py-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors text-sm"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Plant context */}
        {plants.length > 0 && messages.length <= 1 && (
          <div className="mt-6">
            <p className="text-sm text-neutral-600 mb-3">Ask about your plants:</p>
            <div className="space-y-2">
              {plants.slice(0, 3).map((plant) => (
                <button
                  key={plant.id}
                  onClick={() => handleSuggestionClick(`How is my ${plant.name} doing?`)}
                  className="w-full flex items-center gap-3 p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors"
                >
                  <img
                    src={plant.image}
                    alt={plant.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <p className="text-sm">{plant.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-neutral-200">
        <div className="flex gap-2">
          <Button size="icon" variant="outline" className="flex-shrink-0">
            <Camera className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Ask about plant care..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}