import { Metadata } from "next";
import { redirect } from "next/navigation";

// This page handles the dynamic question routes
// e.g., /interview-practice/react/what-is-react

interface QuestionPageProps {
  params: Promise<{
    topic: string;
    question: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: QuestionPageProps): Promise<Metadata> {
  const { topic, question } = await params;

  try {
    // Fetch question data from API
    const response = await fetch(
      `http://localhost:1337/api/questions?filters[slug][$eq]=${question}&populate[technology][populate]=category&populate=author`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return {
        title: `${question} | ${topic} Interview Questions`,
        description: `Learn about ${question} in ${topic} interview questions and answers.`,
      };
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const questionData = data.data[0];
      const technologyName = questionData.technology?.title || topic;

      return {
        title:
          questionData.metaTitle ||
          `${questionData.title} | ${technologyName} Interview Questions`,
        description:
          questionData.metaDescription || questionData.answer.substring(0, 160),
        openGraph: {
          title: questionData.metaTitle || questionData.title,
          description:
            questionData.metaDescription ||
            questionData.answer.substring(0, 160),
          type: "article",
          url: `https://yourdomain.com/interview-practice/${topic}/${question}`,
        },
        twitter: {
          card: "summary_large_image",
          title: questionData.metaTitle || questionData.title,
          description:
            questionData.metaDescription ||
            questionData.answer.substring(0, 160),
        },
        alternates: {
          canonical: `https://yourdomain.com/interview-practice/${topic}/${question}`,
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  return {
    title: `${question} | ${topic} Interview Questions`,
    description: `Learn about ${question} in ${topic} interview questions and answers.`,
  };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  // Redirect to the main topic page - the topic page will handle displaying the specific question
  const { topic, question } = await params;
  redirect(`/interview-practice/${topic}?question=${question}`);
}
