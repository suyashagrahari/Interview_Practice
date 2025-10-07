import { useState, useCallback } from "react";

export const useCompletedQuestions = () => {
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(
    new Set()
  );

  const toggleQuestionCompletion = useCallback((questionId: string) => {
    setCompletedQuestions((prev) => {
      const newCompleted = new Set(prev);
      if (newCompleted.has(questionId)) {
        newCompleted.delete(questionId);
      } else {
        newCompleted.add(questionId);
      }
      return newCompleted;
    });
  }, []);

  const getProgressPercentage = useCallback(
    (totalQuestions: number) => {
      const completedCount = completedQuestions.size;
      return Math.round((completedCount / totalQuestions) * 100);
    },
    [completedQuestions]
  );

  return {
    completedQuestions,
    toggleQuestionCompletion,
    getProgressPercentage,
  };
};
