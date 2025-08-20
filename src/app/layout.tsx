import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
// import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "InterviewPro - AI-Powered Interview Platform",
  description:
    "Transform your interview preparation with our advanced AI platform. Practice with intelligent models, get real-time feedback, and ace your next interview with confidence.",
  keywords: [
    "AI Interview",
    "Interview Practice",
    "AI Platform",
    "Interview Preparation",
    "Mock Interviews",
    "AI Assistant",
  ],
  authors: [{ name: "InterviewPro Team" }],
  creator: "InterviewPro",
  publisher: "InterviewPro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://interviewpro.ai"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://interviewpro.ai",
    title: "InterviewPro - AI-Powered Interview Platform",
    description:
      "Transform your interview preparation with our advanced AI platform. Practice with intelligent models, get real-time feedback, and ace your next interview with confidence.",
    siteName: "InterviewPro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "InterviewPro - AI-Powered Interview Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InterviewPro - AI-Powered Interview Platform",
    description:
      "Transform your interview preparation with our advanced AI platform. Practice with intelligent models, get real-time feedback, and ace your next interview with confidence.",
    images: ["/og-image.jpg"],
    creator: "@interviewpro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <AuthProvider>
            {children}
            {/* <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "hsl(var(--background))",
                  color: "hsl(var(--foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            /> */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
