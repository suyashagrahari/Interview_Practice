"use client";

import { useState } from "react";
import { Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react";

interface SocialSharingProps {
  title: string;
  url: string;
  description: string;
}

const SocialSharing = ({ title, url, description }: SocialSharingProps) => {
  const [copied, setCopied] = useState(false);

  const handleSocialShare = (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          title
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.log("Error copying link:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleSocialShare("twitter")}
        className="p-2 text-gray-500 hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
        title="Share on Twitter">
        <Twitter className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleSocialShare("facebook")}
        className="p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
        title="Share on Facebook">
        <Facebook className="w-4 h-4" />
      </button>

      <button
        onClick={() => handleSocialShare("linkedin")}
        className="p-2 text-gray-500 hover:text-blue-700 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
        title="Share on LinkedIn">
        <Linkedin className="w-4 h-4" />
      </button>

      <button
        onClick={handleCopyLink}
        className="p-2 text-gray-500 hover:text-green-600 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
        title="Copy link">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SocialSharing;
