import { IconSend2, IconTable } from "@tabler/icons-react";
import React, { useState } from "react";

const Chat = () => {
  const [query, setquery] = useState("");
  const [conversation, setConversation] = useState([
    {
      id: 1,
      user: "Bot",
      message: "Hello, how are you?",
    },
  ]);

  const handleSendMessage = (message) => {
    if (!message.trim()) return;
    const newMessage = {
      id: conversation.length + 1,
      user: "User",
      message: message,
    };
    setConversation([...conversation, newMessage]);
    setquery("");
    setTimeout(() => {
      handleBotResponse("Hi Pig 🐷");
    }, 1000);
  };

  const handleBotResponse = (message) => {
    const botMessage = {
      id: conversation.length + 1,
      user: "Bot",
      message: message,
    };
    setConversation((prev) => [...prev, botMessage]);
  };

  const botMessages = (messages) => {
    return (
      <div className="mb-4 left-0 text-left w-[50%]">
        <div className="text-orange-900 font-semibold">Bot</div>
        <div className="rounded-2xl bg-orange-200 p-2 w-fit mr-auto">
          <div className="text-gray-700">{messages}</div>
        </div>
      </div>
    );
  };

  const userMessages = (messages) => {
    return (
      <div className="mb-4 right-0 text-right">
        <div className="text-orange-900 font-semibold">Me</div>
        <div className="rounded-2xl bg-orange-300 p-2 w-fit ml-auto">
          <div className="text-gray-700">{messages}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-orange-50 relative h-full flex flex-col ">
      <div className="text-3xl font-semibold text-orange-900 p-4 text-center">
        Chat
      </div>
      <div className=" flex h-full overflow-hidden">
        <div className=" h-[80%] w-full overflow-y-scroll p-4">
          {/* Example chat messages */}

          {conversation.map((msg) =>
            msg.user === "Bot"
              ? botMessages(msg.message)
              : userMessages(msg.message)
          )}
        </div>
        <div className="flex w-full justify-center bottom-6 absolute">
          <div className="flex rounded-4xl border-orange-900 border-2 w-[80%] gap-1 bg-white p-2 ">
            <IconTable className="text-orange-900 " />
            <input
              type="text"
              className="w-full focus:ring-0 focus:outline-0"
              placeholder="Type your message here..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(e.target.value);
                }
              }}
              value={query}
              onChange={(e) => setquery(e.target.value)}
            />
            <IconSend2
              onClick={() => handleSendMessage(query)}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
