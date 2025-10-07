import { useState, useCallback, useRef } from "react";
import type { ChatMessage } from "../types/interview.types";
import type { AnswerAnalysis } from "@/lib/api/interview-realtime";

export const useInterviewChat = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const getCurrentTimestamp = useCallback(() => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const addMessageToChat = useCallback(
    (
      type: "ai" | "user",
      message: string,
      questionId?: string,
      answer?: string,
      analysis?: AnswerAnalysis
    ) => {
      const newMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random()}`,
        type,
        message,
        timestamp: getCurrentTimestamp(),
        questionId,
        answer,
        analysis,
      };
      setChatMessages((prev) => [...prev, newMessage]);

      // Scroll to bottom of chat
      setTimeout(() => {
        if (chatMessagesRef.current) {
          chatMessagesRef.current.scrollTop =
            chatMessagesRef.current.scrollHeight;
        }
      }, 100);
    },
    [getCurrentTimestamp]
  );

  return {
    chatMessages,
    setChatMessages,
    chatMessagesRef,
    addMessageToChat,
    getCurrentTimestamp,
  };
};
