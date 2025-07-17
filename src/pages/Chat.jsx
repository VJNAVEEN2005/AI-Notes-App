import { IconSend2, IconTable } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import { initChat, askGemini } from "../ai/gemini_chat";
import gsap from "gsap";
import BotMessage from "../components/BotMessage";
import UserMessage from "../components/UserMessage";

const Chat = () => {
  const [query, setquery] = useState("");
  const [conversation, setConversation] = useState([
    {
      id: 1,
      user: "Bot",
      message: "Hello, how are you?",
    },
  ]);

  const botRefs = useRef({});
  const userRefs = useRef({});
  const inputRef = useRef(null);
  const sendButtonRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    initChat();
    
    // Initial animations
    gsap.from(chatContainerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out"
    });
  }, []);

  // Animate bot message only once when it's first created
  const animateBotMessage = (id) => {
    const el = botRefs.current[id];
    if (el) {
      gsap.fromTo(
        el,
        { 
          opacity: 0, 
          y: 20,
          scale: 0.95
        },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          duration: 0.5, 
          ease: "back.out(1.7)"
        }
      );
    }
  };

  // Animate user message
  const animateUserMessage = (id) => {
    const el = userRefs.current[id];
    if (el) {
      gsap.fromTo(
        el,
        { 
          opacity: 0, 
          x: 20,
          scale: 0.95
        },
        { 
          opacity: 1, 
          x: 0, 
          scale: 1,
          duration: 0.4, 
          ease: "power2.out"
        }
      );
    }
  };

  // Animate input field on focus/blur
  const animateInputFocus = (focused) => {
    const inputContainer = inputRef.current?.parentElement;
    if (inputContainer) {
      gsap.to(inputContainer, {
        scale: focused ? 1.02 : 1,
        borderColor: focused ? "#ea580c" : "#9a3412",
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  // Animate send button
  const animateSendButton = () => {
    if (sendButtonRef.current) {
      gsap.to(sendButtonRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    }
  };

  // Animate typing indicator
  const animateTypingIndicator = () => {
    const typingDots = document.querySelectorAll('.typing-dot');
    typingDots.forEach((dot, index) => {
      gsap.to(dot, {
        y: -5,
        duration: 0.4,
        delay: index * 0.1,
        yoyo: true,
        repeat: -1,
        ease: "power2.inOut"
      });
    });
  };

  // Scroll to bottom animation
  const scrollToBottom = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      gsap.to(chatContainer, {
        scrollTop: chatContainer.scrollHeight,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    // Animate send button
    animateSendButton();

    const userMessage = {
      id: conversation.length + 1,
      user: "User",
      message,
    };

    setConversation((prev) => [...prev, userMessage]);
    setquery("");

    // Animate user message after it's added
    setTimeout(() => {
      animateUserMessage(userMessage.id);
      scrollToBottom();
    }, 50);

    const botMessageId = conversation.length + 2;
    setIsTyping(true);

    // Add empty bot message for streaming
    setConversation((prev) => [
      ...prev,
      { id: botMessageId, user: "Bot", message: "" },
    ]);

    // Animate bot message container (only once when created)
    setTimeout(() => {
      animateBotMessage(botMessageId);
      scrollToBottom();
    }, 100);

    let isFirstChunk = true;

    await askGemini(
      message,
      (chunk) => {
        setConversation((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, message: msg.message + chunk }
              : msg
          )
        );

        // Only scroll to bottom, don't re-animate the message
        if (isFirstChunk) {
          isFirstChunk = false;
          setIsTyping(false);
        }
        
        // Smooth scroll to bottom as content updates
        setTimeout(() => scrollToBottom(), 10);
      },
      (errorText) => {
        setConversation((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId ? { ...msg, message: errorText } : msg
          )
        );
        setIsTyping(false);
      }
    );
  };

  // Animate messages when they first appear
  useEffect(() => {
    if (conversation.length > 0) {
      animateTypingIndicator();
    }
  }, [isTyping]);

  return (
    <div className="w-full bg-orange-50 relative h-full flex flex-col">
      <div className="text-3xl font-semibold text-orange-900 p-4 text-center">
        Chat
      </div>
      <div className="flex h-full overflow-hidden ">
        <div 
          ref={chatContainerRef}
          className="h-[88%] w-full overflow-y-auto p-4 scroll-smooth"
          style={{
            scrollbarWidth:"thin",
            scrollbarColor: "#ea580c #fef3c7",
            scrollbarTrackColor: "#fef3c7",
          }}
        >
          {conversation.map((msg) =>
            msg.user === "Bot" ? <BotMessage key={msg.id} msg={msg} botRefs={botRefs} isTyping={isTyping} /> : <UserMessage key={msg.id} msg={msg} userRefs={userRefs} />
          )}
        </div>
        <div className="flex w-full justify-center bottom-6 absolute">
          <div className="flex rounded-4xl border-orange-900 border-2 w-[80%] gap-1 bg-white p-2 shadow-lg transition-all duration-200">
            <IconTable className="text-orange-900" />
            <input
              ref={inputRef}
              type="text"
              className="w-full focus:ring-0 focus:outline-0 transition-all duration-200"
              placeholder="Type your message here..."
              onFocus={() => animateInputFocus(true)}
              onBlur={() => animateInputFocus(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(e.target.value);
                }
              }}
              value={query}
              onChange={(e) => setquery(e.target.value)}
            />
            <IconSend2
              ref={sendButtonRef}
              onClick={() => handleSendMessage(query)}
              className="cursor-pointer text-orange-900 hover:text-orange-700 transition-colors duration-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;