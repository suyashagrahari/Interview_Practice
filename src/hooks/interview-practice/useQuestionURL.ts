import { useCallback } from "react";

interface Question {
  id: string | number;
  slug?: string;
}

export const useQuestionURL = (
  questions: Question[],
  topicSlug: string
) => {
  const updateQuestionURL = useCallback(
    (questionId: string) => {
      const question = questions.find((q) => q.id.toString() === questionId);
      if (question && question.slug) {
        const newUrl = `/interview-practice/${topicSlug}/${question.slug}`;
        window.history.pushState({}, "", newUrl);
        console.log("🔗 URL updated to:", newUrl);
      }
    },
    [questions, topicSlug]
  );

  return { updateQuestionURL };
};
