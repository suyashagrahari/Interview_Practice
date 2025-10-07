import React, { RefObject } from "react";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import type { ChatMessage } from "../../types/interview.types";

interface ChatSectionProps {
  isDarkMode: boolean;
  chatMessages: ChatMessage[];
  chatMessagesRef: RefObject<HTMLDivElement>;
  onMessageClick: (message: ChatMessage) => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  isDarkMode,
  chatMessages,
  chatMessagesRef,
  onMessageClick,
}) => {
  return (
    <div
      className={`w-[30%] flex flex-col ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-md border-l border-slate-700/50"
          : "bg-gradient-to-b from-white/95 to-slate-50/95 backdrop-blur-md border-l border-slate-200/50"
      }`}>
      {/* Chat Messages */}
      <div
        ref={chatMessagesRef}
        className={`flex-1 p-6 space-y-4 overflow-y-auto min-h-0 ${
          isDarkMode ? "bg-slate-900/20" : "bg-slate-50/20"
        }`}>
        {chatMessages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}>
            <div
              className={`flex items-start space-x-3 max-w-[100%] ${
                message.type === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
              onClick={() => onMessageClick(message)}>
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                  message.type === "user"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600"
                    : isDarkMode
                    ? "bg-gradient-to-br from-slate-700 to-slate-800"
                    : "bg-gradient-to-br from-slate-100 to-slate-200"
                }`}>
                {message.type === "ai" ? (
                  <Bot
                    className={`w-5 h-5 ${
                      isDarkMode ? "text-slate-300" : "text-slate-600"
                    }`}
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`flex-1 min-w-0 ${
                  message.type === "user" ? "text-right" : "text-left"
                }`}>
                {/* Header with name and timestamp */}
                <div
                  className={`flex items-center space-x-2 mb-2 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}>
                  <span
                    className={`text-xs font-semibold ${
                      message.type === "user"
                        ? "text-blue-500"
                        : isDarkMode
                        ? "text-slate-300"
                        : "text-slate-600"
                    }`}>
                    {message.type === "ai" ? "AI Interviewer" : "You"}
                  </span>
                  <span
                    className={`text-xs ${
                      isDarkMode ? "text-slate-500" : "text-slate-500"
                    }`}>
                    {message.timestamp}
                  </span>
                  {/* Message type badges */}
                  <div
                    className={`flex space-x-1 ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}>
                    {message.questionId && (
                      <span
                        className={`text-xs px-2 py-1 rounded-lg font-medium ${
                          isDarkMode
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                        Q
                      </span>
                    )}
                    {message.answer && (
                      <span
                        className={`text-xs px-2 py-1 rounded-lg font-medium ${
                          isDarkMode
                            ? "bg-green-500/20 text-green-400"
                            : "bg-green-100 text-green-700"
                        }`}>
                        A
                      </span>
                    )}
                  </div>
                </div>

                {/* Message text */}
                <div
                  className={`text-sm leading-relaxed break-words ${
                    message.type === "user"
                      ? isDarkMode
                        ? "text-blue-200"
                        : "text-blue-800"
                      : isDarkMode
                      ? "text-slate-200"
                      : "text-slate-700"
                  } ${message.type === "user" ? "text-left" : "text-left"}`}>
                  {message.message}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
