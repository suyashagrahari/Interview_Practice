interface StructuredDataProps {
  type: "article" | "website" | "organization";
  title: string;
  description: string;
  url: string;
  image?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
}

const StructuredData = ({
  type,
  title,
  description,
  url,
  image,
  author,
  publishedTime,
  modifiedTime,
  keywords,
}: StructuredDataProps) => {
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type":
        type === "article"
          ? "Article"
          : type === "organization"
          ? "Organization"
          : "WebSite",
      name: title,
      description: description,
      url: url,
      image: image || "https://yourdomain.com/og-default.jpg",
      publisher: {
        "@type": "Organization",
        name: "AI Interview Practice Platform",
        logo: {
          "@type": "ImageObject",
          url: "https://yourdomain.com/logo.png",
        },
      },
    };

    if (type === "article") {
      return {
        ...baseData,
        author: {
          "@type": "Person",
          name: author || "AI Interview Team",
        },
        datePublished: publishedTime || new Date().toISOString(),
        dateModified: modifiedTime || new Date().toISOString(),
        keywords:
          keywords?.join(", ") ||
          "interview practice, technical interview, coding questions",
        articleSection: "Interview Practice",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
      };
    }

    if (type === "organization") {
      return {
        ...baseData,
        foundingDate: "2024",
        sameAs: [
          "https://twitter.com/aiinterviewpro",
          "https://linkedin.com/company/aiinterviewpro",
          "https://github.com/aiinterviewpro",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer service",
          email: "support@aiinterviewpro.com",
        },
      };
    }

    return baseData;
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData()),
      }}
    />
  );
};

export default StructuredData;

