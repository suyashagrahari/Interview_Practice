"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Mic,
  Shield,
  AlertTriangle,
  CheckCircle,
  Eye,
  Monitor,
  Smartphone,
  Copy,
  ExternalLink,
  Users,
  Clock,
  FileText,
  Zap,
  ChevronRight,
  ChevronLeft,
  Lock,
  AlertCircle,
} from "lucide-react";

interface InterviewGuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartInterview: () => void;
}

const InterviewGuidelinesModal = ({
  isOpen,
  onClose,
  onStartInterview,
}: InterviewGuidelinesModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const totalSteps = 4;

  const handleStepCheck = (step: number) => {
    const newCheckedSteps = new Set(checkedSteps);
    if (newCheckedSteps.has(step)) {
      newCheckedSteps.delete(step);
    } else {
      newCheckedSteps.add(step);
    }
    setCheckedSteps(newCheckedSteps);
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    return checkedSteps.has(currentStep);
  };

  const canStartInterview = () => {
    return checkedSteps.size === totalSteps && agreedToTerms;
  };

  const steps = [
    {
      id: 1,
      title: "Camera & Microphone Access",
      icon: <Camera className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Camera Requirements
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Camera must be enabled and working properly</li>
                  <li>
                    • Ensure good lighting and clear visibility of your face
                  </li>
                  <li>
                    • Position camera at eye level for professional appearance
                  </li>
                  <li>• Remove any distracting backgrounds or objects</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Mic className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Microphone Requirements
                </h4>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• Microphone must be enabled and functioning</li>
                  <li>• Test audio quality before starting the interview</li>
                  <li>• Use a quiet environment to avoid background noise</li>
                  <li>• Speak clearly and at an appropriate volume</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Important Notice
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Your camera and microphone will be continuously monitored
                  during the interview. Any attempt to disable them will result
                  in immediate interview termination.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Anti-Cheating Measures",
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                  Strictly Prohibited Activities
                </h4>
                <ul className="text-sm text-red-800 dark:text-red-200 space-y-2">
                  <li className="flex items-start space-x-2">
                    <Monitor className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Tab Switching:</strong> Switching to other browser
                      tabs or applications
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Copy className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Copy/Paste:</strong> Copying content from external
                      sources
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <ExternalLink className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>External Resources:</strong> Using search engines,
                      documentation, or other websites
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Mobile Devices:</strong> Using phones, tablets, or
                      other devices
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Users className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>External Help:</strong> Receiving assistance from
                      other people
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Proctoring Technology
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Advanced AI monitoring your screen activity</li>
                  <li>• Real-time detection of suspicious behavior</li>
                  <li>• Automatic flagging of potential cheating attempts</li>
                  <li>• Continuous video and audio analysis</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  Detection Capabilities
                </h4>
                <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                  <li>• Multiple people detected in camera view</li>
                  <li>• Unusual eye movement patterns</li>
                  <li>• Keyboard and mouse activity monitoring</li>
                  <li>• Background noise and conversation detection</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Professional Conduct",
      icon: <FileText className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                  Language Policy
                </h4>
                <div className="text-sm text-orange-800 dark:text-orange-200 space-y-2">
                  <p>
                    <strong>First Warning:</strong> If you use any
                    inappropriate, vulgar, or unprofessional language, you will
                    receive a warning.
                  </p>
                  <p>
                    <strong>Second Offense:</strong> Your interview will be
                    immediately cancelled and this incident will be recorded in
                    your profile.
                  </p>
                  <p>
                    <strong>Consequences:</strong> Repeated violations may
                    result in permanent account suspension.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Professional Standards
                </h4>
                <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                  <li>• Maintain a professional and respectful tone</li>
                  <li>• Dress appropriately for a professional interview</li>
                  <li>• Be punctual and prepared</li>
                  <li>• Answer questions honestly and thoughtfully</li>
                  <li>• Show enthusiasm and engagement</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Interview Duration
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Complete the interview within the allocated time</li>
                  <li>• Time extensions are not permitted</li>
                  <li>• Plan your answers to be concise yet comprehensive</li>
                  <li>• Use time management skills effectively</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Final Confirmation",
      icon: <Lock className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Interview Summary
            </h4>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Camera and microphone access confirmed</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Anti-cheating measures understood</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Professional conduct guidelines acknowledged</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>All restrictions and consequences understood</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                  Final Reminder
                </h4>
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  By proceeding, you confirm that you understand all guidelines
                  and agree to maintain professional conduct throughout the
                  interview. Any violation will result in immediate termination
                  and permanent record in your profile.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <input
              type="checkbox"
              id="agree-terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="agree-terms"
              className="text-sm text-blue-800 dark:text-blue-200">
              I have read and understood all guidelines and agree to maintain
              professional conduct during the interview.
            </label>
          </div>
        </div>
      ),
    },
  ];

  const currentStepData = steps[currentStep - 1];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    {currentStepData.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Interview Guidelines</h2>
                    <p className="text-blue-100 text-sm">
                      Step {currentStep} of {totalSteps}:{" "}
                      {currentStepData.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex space-x-2">
                  {Array.from({ length: totalSteps }, (_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        i < currentStep
                          ? "bg-white"
                          : i === currentStep - 1
                          ? "bg-white/60"
                          : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}>
                {currentStepData.content}
              </motion.div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`step-${currentStep}-check`}
                    checked={checkedSteps.has(currentStep)}
                    onChange={() => handleStepCheck(currentStep)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`step-${currentStep}-check`}
                    className="text-sm text-gray-700 dark:text-gray-300">
                    I have read and understood this step
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  {currentStep > 1 && (
                    <button
                      onClick={handlePrevious}
                      className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200 flex items-center space-x-2">
                      <ChevronLeft className="w-4 h-4" />
                      <span>Previous</span>
                    </button>
                  )}

                  {currentStep < totalSteps ? (
                    <button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                        canProceed()
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      }`}>
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={onStartInterview}
                      disabled={!canStartInterview()}
                      className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                        canStartInterview()
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                      }`}>
                      <span>Start Interview</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InterviewGuidelinesModal;

