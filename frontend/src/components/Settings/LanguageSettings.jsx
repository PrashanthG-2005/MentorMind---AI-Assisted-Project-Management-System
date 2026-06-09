import { Globe, Clock } from "lucide-react";

const LanguageSettings = () => {
  const languages = [
    { code: "en-US", name: "English (United States)", native: "English" },
    { code: "en-GB", name: "English (United Kingdom)", native: "English" },
    { code: "hi", name: "Hindi", native: "हिन्दी" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "es", name: "Spanish", native: "Español" },
    { code: "fr", name: "French", native: "Français" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">System Language</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {languages.map((lang) => (
            <button 
              key={lang.code}
              className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                lang.code === "en-US" ? "border-indigo-600 bg-indigo-50/10 dark:bg-indigo-900/10 shadow-lg shadow-indigo-500/5" : "border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 bg-gray-50/50 dark:bg-gray-900/30"
              }`}
            >
              <div className="text-left">
                <p className="font-semibold text-sm text-gray-900 dark:text-white">{lang.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{lang.native}</p>
              </div>
              {lang.code === "en-US" && (
                <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Time & Date</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Timezone</label>
            <select className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white">
              <option value="Asia/Kolkata">IST (UTC+05:30) - Mumbai, Kolkata, Chennai</option>
              <option value="Europe/London">GMT (UTC+00:00) - London, Lisbon</option>
              <option value="America/New_York">EST (UTC-05:00) - New York, Toronto</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date Format</label>
            <select className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white">
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-4">
        <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all hover:scale-[1.02]">
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default LanguageSettings;
