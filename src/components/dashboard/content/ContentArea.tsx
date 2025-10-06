import { motion, AnimatePresence } from "framer-motion";
import ProfileContent from "@/components/profile/profile-content";
import SettingsContent from "@/components/settings/settings-content";
import ResumeBasedInterview from "@/components/interview/resume-based-interview";
import JobDescriptionInterview from "@/components/interview/job-description-interview";
import TopicBasedInterview from "@/components/interview/topic-based-interview";
import CompanyBasedInterview from "@/components/interview/company-based-interview";
import { ANIMATION_VARIANTS } from "@/constants/dashboard";
import { ContentView, InterviewTab } from "@/types/dashboard";

interface ContentAreaProps {
  contentView: ContentView;
  activeTab: InterviewTab;
  onCloseProfile: () => void;
  onCloseSettings: () => void;
  onCloseInterview: () => void;
  onStartInterview: (formData?: Record<string, unknown>) => void;
}

/**
 * Main content area component that displays different views
 */
export const ContentArea: React.FC<ContentAreaProps> = ({
  contentView,
  activeTab,
  onCloseProfile,
  onCloseSettings,
  onCloseInterview,
  onStartInterview,
}) => {
  return (
    <div className="flex-1 overflow-hidden min-w-0">
      <div className="h-full overflow-y-auto">
        <AnimatePresence mode="wait">
          {contentView === "settings" ? (
            <motion.div
              key="settings"
              initial={ANIMATION_VARIANTS.content.initial}
              animate={ANIMATION_VARIANTS.content.animate}
              exit={ANIMATION_VARIANTS.content.exit}
              transition={ANIMATION_VARIANTS.content.transition}
              className="h-full"
            >
              <SettingsContent onClose={onCloseSettings} />
            </motion.div>
          ) : contentView === "profile" ? (
            <motion.div
              key="profile"
              initial={ANIMATION_VARIANTS.content.initial}
              animate={ANIMATION_VARIANTS.content.animate}
              exit={ANIMATION_VARIANTS.content.exit}
              transition={ANIMATION_VARIANTS.content.transition}
              className="h-full"
            >
              <ProfileContent onClose={onCloseProfile} />
            </motion.div>
          ) : (
            <motion.div
              key="interview"
              initial={ANIMATION_VARIANTS.content.initial}
              animate={ANIMATION_VARIANTS.content.animate}
              exit={ANIMATION_VARIANTS.content.exit}
              transition={ANIMATION_VARIANTS.content.transition}
              className="h-full"
            >
              {activeTab === "resume" && (
                <ResumeBasedInterview
                  onBack={onCloseInterview}
                  onStartInterview={onStartInterview}
                />
              )}
              {activeTab === "job-description" && (
                <JobDescriptionInterview
                  onBack={onCloseInterview}
                  onStartInterview={onStartInterview}
                />
              )}
              {activeTab === "topic" && (
                <TopicBasedInterview
                  onBack={onCloseInterview}
                  onStartInterview={onStartInterview}
                />
              )}
              {activeTab === "company" && (
                <CompanyBasedInterview
                  onBack={onCloseInterview}
                  onStartInterview={onStartInterview}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
