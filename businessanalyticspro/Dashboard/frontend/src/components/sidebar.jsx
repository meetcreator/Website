import { useState, useEffect } from "react";
import { BarChart3, FileText, Home, Box, Users, UserCircle, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function Sidebar({ darkMode, activeTab, setActiveTab, isOpen, setIsOpen }) {
  const [expanded, setExpanded] = useState(true);

  // Handle window resize to auto-close/open or adjust state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setExpanded(true); // Full width on mobile when open
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { icon: Home, label: "Dashboard", id: "overview" },
    { icon: BarChart3, label: "Charts", id: "charts" },
    { icon: BarChart3, label: "Correlation", id: "correlation" },
    { icon: FileText, label: "Data", id: "data" },
    { type: "divider" },
    { icon: Box, label: "Inventory", id: "inventory" },
    { icon: Users, label: "Vendors", id: "vendors" },
    { icon: UserCircle, label: "Employees", id: "employees" },
  ];

  const handleTabClick = (id) => {
    setActiveTab(id);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:z-0
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transition-all duration-300 flex flex-col h-screen
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${expanded ? "w-64" : "w-20"}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {expanded ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                  📊
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800 dark:text-white">TINMCO</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Analytics v2.0</p>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold mx-auto">
                📊
              </div>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Toggle Button (Desktop Only) */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="hidden lg:flex absolute top-20 -right-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10"
        >
          {expanded ? <ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" /> : <ChevronRight size={16} className="text-gray-600 dark:text-gray-300" />}
        </button>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item, idx) => {
            if (item.type === "divider") {
              return <div key={idx} className="h-px bg-gray-200 dark:bg-gray-700 my-3" />;
            }

            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
                  } ${!expanded && "lg:justify-center"}`}
              >
                <Icon size={20} />
                {(expanded || window.innerWidth < 1024) && <span className="text-sm">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Footer - User Info */}
        {(expanded || window.innerWidth < 1024) && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin User</p>
                <p className="text-xs text-green-500 font-medium">● Online</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
