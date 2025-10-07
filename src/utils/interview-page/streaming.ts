import { INTERVIEW_CONSTANTS } from "../constants/interview.constants";

export const streamText = async (
  text: string,
  onUpdate: (currentText: string) => void,
  wordDelay: number = INTERVIEW_CONSTANTS.STREAMING.WORD_DELAY
): Promise<void> => {
  const words = text.split(" ");
  for (let i = 0; i <= words.length; i++) {
    onUpdate(words.slice(0, i).join(" "));
    await new Promise((resolve) => setTimeout(resolve, wordDelay));
  }
};

export const streamQuestionToChat = async (
  questionText: string,
  questionId: string,
  chatMessages: any[],
  setChatMessages: (messages: any[] | ((prev: any[]) => any[])) => void,
  getCurrentTimestamp: () => string
): Promise<void> => {
  // Create a temporary message for streaming in chat
  const tempMessageId = `temp-${Date.now()}`;
  const tempMessage = {
    id: tempMessageId,
    type: "ai" as const,
    message: "",
    timestamp: getCurrentTimestamp(),
    questionId,
  };

  // Add temporary message to chat
  setChatMessages((prev) => [...prev, tempMessage]);

  // Stream word by word
  const words = questionText.split(" ");
  for (let i = 0; i <= words.length; i++) {
    const currentText = words.slice(0, i).join(" ");

    // Update the temporary message in chat
    setChatMessages((prev) =>
      prev.map((msg) =>
        msg.id === tempMessageId ? { ...msg, message: currentText } : msg
      )
    );

    await new Promise((resolve) =>
      setTimeout(resolve, INTERVIEW_CONSTANTS.STREAMING.QUESTION_WORD_DELAY)
    );
  }
};
