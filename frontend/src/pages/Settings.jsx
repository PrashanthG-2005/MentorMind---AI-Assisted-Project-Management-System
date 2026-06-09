import { useState } from "react";
import { 
  Settings as SettingsIcon
} from "lucide-react";

import SettingsHeader from "../components/Settings/SettingsHeader";
import SettingsSidebar from "../components/Settings/SettingsSidebar";
import SecuritySettings from "../components/Settings/SecuritySettings";
import NotificationSettings from "../components/Settings/NotificationSettings";
import AppearanceSettings from "../components/Settings/AppearanceSettings";
import PrivacySettings from "../components/Settings/PrivacySettings";
import LanguageSettings from "../components/Settings/LanguageSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("security");

  const renderContent = () => {
    switch (activeTab) {
      case "security":
        return <SecuritySettings />;
      case "notifications":
        return <NotificationSettings />;
      case "appearance":
        return <AppearanceSettings />;
      case "privacy":
        return <PrivacySettings />;
      case "language":
        return <LanguageSettings />;
      default:
        return <SecuritySettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <SettingsHeader />

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
