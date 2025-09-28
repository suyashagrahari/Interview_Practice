"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  Shield,
  AlertCircle,
  CheckCircle,
  X,
  Users,
  FileText,
  Clock,
  Eye,
} from "lucide-react";

interface InitialWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InitialWarningModal: React.FC<InitialWarningModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden border-2 border-yellow-500"
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 text-center">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>

              {/* Warning Icon */}
              <div className="flex justify-center mb-2">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>

              {/* Warning Title */}
              <h2 className="text-lg font-bold mb-1 text-yellow-700 dark:text-yellow-300">
                Interview Warning System
              </h2>

              {/* Subtitle */}
              <p className="text-yellow-600 dark:text-yellow-400 text-xs">
                Please read and understand our professional conduct guidelines
              </p>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[50vh] overflow-y-auto">
              {/* Main Warning Message */}
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-900 dark:text-red-100 mb-1">
                      Important: Professional Conduct Required
                    </h3>
                    <p className="text-xs text-red-800 dark:text-red-200 leading-relaxed">
                      This interview platform uses advanced AI to monitor your
                      responses for professional conduct. Any inappropriate,
                      abusive, or unprofessional language will result in
                      immediate warnings and potential interview termination.
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning System Details */}
              <div className="space-y-3 mb-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                        Warning System (2-Strike Policy)
                      </h4>
                      <ul className="text-xs text-yellow-800 dark:text-yellow-200 space-y-1">
                        <li className="flex items-start space-x-1">
                          <span className="font-bold text-yellow-600">
                            1st Warning:
                          </span>
                          <span>
                            Yellow warning border and professional conduct
                            reminder
                          </span>
                        </li>
                        <li className="flex items-start space-x-1">
                          <span className="font-bold text-red-600">
                            2nd Warning:
                          </span>
                          <span>
                            Interview terminated and recorded in your profile
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        What We Monitor
                      </h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Abusive, vulgar, or offensive language</li>
                        <li>• Unprofessional tone or disrespectful comments</li>
                        <li>• Inappropriate content or personal attacks</li>
                        <li>• Any form of harassment or discrimination</li>
                      </ul>
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
                        <li>
                          • Maintain respectful and professional communication
                        </li>
                        <li>
                          • Focus on providing relevant, constructive answers
                        </li>
                        <li>
                          • Demonstrate your skills and knowledge appropriately
                        </li>
                        <li>• Treat this as a real professional interview</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Indicators */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Visual Warning Indicators
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Yellow Border:</strong> First warning active -
                      maintain professional conduct
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Red Border:</strong> Final warning - next
                      violation terminates interview
                    </span>
                  </div>
                </div>
              </div>

              {/* Consequences */}
              <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">
                      Consequences of Violations
                    </h4>
                    <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                      <li>
                        • Warning incidents are permanently recorded in your
                        profile
                      </li>
                      <li>• Future employers can see your conduct history</li>
                      <li>• Account suspension for repeated violations</li>
                      <li>• Loss of access to interview practice features</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 pt-0">
              <button
                onClick={onClose}
                className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium text-sm transition-colors shadow-lg hover:shadow-xl">
                I Understand - Start Interview
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialWarningModal;
