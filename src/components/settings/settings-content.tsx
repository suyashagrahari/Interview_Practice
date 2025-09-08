"use client";

import { useState } from "react";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Trash2,
} from "lucide-react";

interface SettingsContentProps {
  onClose?: () => void;
}

export default function SettingsContent({ onClose }: SettingsContentProps) {
  const [activeTab, setActiveTab] = useState("account");

  const settingsTabs = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "language", label: "Language", icon: Globe },
    { id: "data", label: "Data & Storage", icon: Database },
  ] as const;

  const renderAccountSettings = () => (
    <div className="space-y-8">
      {/* Account Information Section */}
      <div>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Account Information
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your personal account details and contact information
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              defaultValue="Test User"
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              defaultValue="test@example.com"
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-white/20 rounded-lg bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="pt-6 border-t border-gray-200/20 dark:border-white/10">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Security Settings
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account security and authentication preferences
          </p>
        </div>
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-4 border border-gray-200/20 dark:border-white/10 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-500/10 dark:hover:to-purple-500/10 transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-lg flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-purple-500/20 dark:group-hover:from-blue-500/30 dark:group-hover:to-purple-500/30 transition-all duration-200">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  Change Password
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Update your account password for better security
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">
                →
              </div>
            </div>
          </button>
          <button className="w-full text-left px-4 py-4 border border-gray-200/20 dark:border-white/10 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-500/10 dark:hover:to-purple-500/10 transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-lg flex items-center justify-center group-hover:from-green-500/20 group-hover:to-emerald-500/20 dark:group-hover:from-green-500/30 dark:group-hover:to-emerald-500/30 transition-all duration-200">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">
                  Two-Factor Authentication
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Add an extra layer of security to your account
                </div>
              </div>
              <div className="text-gray-400 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors duration-200">
                →
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSettings = () => (
    <div className="space-y-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Notification Preferences
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Choose how you want to be notified about updates and activities
        </p>
      </div>
      <div className="space-y-4">
        {[
          {
            label: "Email Notifications",
            description: "Receive updates via email",
            icon: "📧",
          },
          {
            label: "Push Notifications",
            description: "Get notified on your device",
            icon: "🔔",
          },
          {
            label: "Interview Reminders",
            description: "Reminders for upcoming interviews",
            icon: "📅",
          },
          {
            label: "Weekly Reports",
            description: "Weekly performance summaries",
            icon: "📊",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border border-gray-200/20 dark:border-white/10 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 dark:hover:from-blue-500/5 dark:hover:to-purple-500/5 transition-all duration-200 group">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{item.icon}</div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">
                  {item.label}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {item.description}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-purple-600 group-hover:shadow-md"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeTab) {
      case "account":
        return renderAccountSettings();
      case "notifications":
        return renderNotificationsSettings();
      case "privacy":
        return (
          <div className="space-y-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Privacy Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Control your privacy and data sharing preferences
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200/50 dark:border-blue-500/30 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Privacy Settings Coming Soon
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced privacy controls and data management options will be
                available in a future update.
              </p>
            </div>
          </div>
        );
      case "appearance":
        return (
          <div className="space-y-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Appearance Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Customize the look and feel of your application
              </p>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-200/50 dark:border-purple-500/30 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Appearance Settings Coming Soon
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Theme customization and appearance options will be available in
                a future update.
              </p>
            </div>
          </div>
        );
      case "language":
        return (
          <div className="space-y-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Language Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose your preferred language and regional settings
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200/50 dark:border-green-500/30 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Language Settings Coming Soon
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Multi-language support and regional preferences will be
                available in a future update.
              </p>
            </div>
          </div>
        );
      case "data":
        return (
          <div className="space-y-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Data & Storage
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your data, storage, and account information
              </p>
            </div>
            <div className="space-y-4">
              <button className="w-full text-left px-4 py-4 border border-red-200/50 dark:border-red-500/30 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-500/10 dark:hover:to-red-500/20 transition-all duration-200 group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500/10 to-red-600/10 dark:from-red-500/20 dark:to-red-600/20 rounded-lg flex items-center justify-center group-hover:from-red-500/20 group-hover:to-red-600/20 dark:group-hover:from-red-500/30 dark:group-hover:to-red-600/30 transition-all duration-200">
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-red-600 dark:text-red-400">
                      Delete Account
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Permanently delete your account and all associated data
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-200">
                    →
                  </div>
                </div>
              </button>
            </div>
          </div>
        );
      default:
        return renderAccountSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Right Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Settings Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200/20 dark:border-white/10 shadow-lg">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Settings
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Manage your account preferences and application settings
                  </p>
                </div>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className=" mt-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-b border-gray-200/20 dark:border-white/10">
          <div className="px-6 py-4">
            <nav className="flex space-x-2 overflow-x-auto">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 text-blue-700 dark:text-blue-200 border border-blue-500/30 dark:border-blue-500/50 shadow-md"
                        : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-500/10 dark:hover:to-purple-500/10 hover:shadow-sm"
                    }`}>
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/20 dark:border-white/10 shadow-xl p-6">
                {renderActiveSection()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
