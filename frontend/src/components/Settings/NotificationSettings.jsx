const NotificationSettings = () => {
  const sections = [
    {
      title: "Email Notifications",
      description: "Control what you receive via email.",
      items: [
        { id: "email_projects", label: "Project Updates", description: "When a project status changes", defaultChecked: true },
        { id: "email_tasks", label: "Task Assignments", description: "When a new task is assigned to you", defaultChecked: true },
        { id: "email_comments", label: "Comments", description: "When someone mentions you in a comment", defaultChecked: false },
        { id: "email_digest", label: "Weekly Digest", description: "A summary of all your activities", defaultChecked: true },
      ]
    },
    {
      title: "Push Notifications",
      description: "In-app and browser notifications.",
      items: [
        { id: "push_reminders", label: "Task Reminders", description: "Approaching deadlines for assigned tasks", defaultChecked: true },
        { id: "push_system", label: "System Alerts", description: "Critical updates and maintenance info", defaultChecked: true },
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {sections.map((section, idx) => (
        <div key={idx} className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">{section.title}</h3>
            <p className="text-sm text-gray-500">{section.description}</p>
          </div>
          
          <div className="space-y-4">
            {section.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all flex-wrap sm:flex-nowrap gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                </div>
                <button className={`relative w-12 h-6 rounded-full transition-all flex items-center ${
                  item.defaultChecked ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all absolute ${
                    item.defaultChecked ? 'right-1' : 'left-1'
                  }`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="flex justify-end p-2">
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-lg hover:bg-indigo-700 transition-all">
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default NotificationSettings;
