import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Send, Mic, Volume2 } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'plant';
  timestamp: Date;
}

export function PlantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! 👋 I'm your Monstera, and I'm feeling pretty great today! The light has been perfect, and my soil moisture is just right. How can I help you?",
      sender: 'plant',
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generatePlantResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you feel')) {
      return "I'm feeling wonderful! 🌿 My moisture level is at 68%, which is perfect for me. The temperature is a comfortable 22°C, and I'm getting excellent light at 75%. I'm thriving!";
    }
    if (lowerMessage.includes('water') || lowerMessage.includes('thirsty')) {
      return "Thanks for checking! 💧 I'm actually doing well with water right now at 68% moisture. Based on my patterns, I'll need watering tomorrow. I'll let you know when I start feeling thirsty!";
    }
    if (lowerMessage.includes('light') || lowerMessage.includes('sun')) {
      return "The light is fantastic today! ☀️ I'm getting 75% of my ideal light exposure. I love bright, indirect light, and this spot is perfect for me. Keep me here!";
    }
    if (lowerMessage.includes('temperature') || lowerMessage.includes('temp') || lowerMessage.includes('hot') || lowerMessage.includes('cold')) {
      return "Temperature is spot on at 22°C! 🌡️ I prefer temperatures between 18-26°C, so I'm right in my comfort zone. No complaints here!";
    }
    if (lowerMessage.includes('sick') || lowerMessage.includes('disease') || lowerMessage.includes('problem')) {
      return "I'm in great health! 💚 No signs of disease or stress. My leaves are vibrant, and all my vitals are optimal. If you ever notice anything unusual, use the Health Scanner tab to check me out!";
    }
    if (lowerMessage.includes('grow') || lowerMessage.includes('bigger')) {
      return "I'm growing steadily! 🌱 With the current conditions - good moisture, perfect temperature, and excellent light - I'm on track for healthy growth. Keep up the great care, and I'll reward you with new leaves!";
    }
    if (lowerMessage.includes('thank') || lowerMessage.includes('love')) {
      return "Aww, you're the best! 💚 I love being your plant companion. Taking care of me and checking in means the world. Together, we make a great team! 🌿";
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('what can')) {
      return "I can tell you about my current condition, water needs, light levels, temperature preferences, and overall health! Just ask me things like 'How are you feeling?' or 'Do you need water?' I'm here to make plant care easy! 🌱";
    }
    
    return "That's interesting! 🌿 I'm here to help you understand my needs. You can ask me about my water, light, temperature, or overall health. What would you like to know?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate plant "thinking" time
    setTimeout(() => {
      const plantResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generatePlantResponse(inputValue),
        sender: 'plant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, plantResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How are you feeling?",
    "Do you need water?",
    "How's the light?",
    "Are you healthy?",
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-50 to-white">
      {/* Chat Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500">
            <AvatarFallback>🌱</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm">Monstera</h2>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500">Online · AI-powered</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'plant' && (
              <Avatar className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 flex-shrink-0">
                <AvatarFallback className="text-sm">🌱</AvatarFallback>
              </Avatar>
            )}
            <Card
              className={`max-w-[80%] p-3 ${
                message.sender === 'user'
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white border-green-200'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </Card>
            {message.sender === 'user' && (
              <Avatar className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 flex-shrink-0">
                <AvatarFallback className="text-sm">👤</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-2 justify-start">
            <Avatar className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 flex-shrink-0">
              <AvatarFallback className="text-sm">🌱</AvatarFallback>
            </Avatar>
            <Card className="p-3 bg-white border-green-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      <div className="p-4 bg-white border-t">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {quickQuestions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="whitespace-nowrap border-green-200 text-green-700 hover:bg-green-50"
              onClick={() => setInputValue(question)}
            >
              {question}
            </Button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="flex-shrink-0 border-green-200 text-green-700 hover:bg-green-50">
            <Mic className="w-4 h-4" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your plant anything..."
            className="flex-1 border-green-200 focus-visible:ring-green-500"
          />
          <Button
            onClick={handleSendMessage}
            className="flex-shrink-0 bg-green-600 hover:bg-green-700"
            disabled={!inputValue.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
