import { useState, useEffect } from "react";
import { Sun, Moon, Menu } from "lucide-react";

export default function Navbar({ darkMode, setDarkMode, toggleMobileMenu }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = currentTime.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        {/* Left Section - Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0">
              TB
            </div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white truncate max-w-[150px] sm:max-w-none">
              <span className="hidden sm:inline">TINMCO Business Analytics</span>
              <span className="sm:hidden">TINMCO</span>
            </h1>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Date/Time */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
            <span>{formattedDateTime}</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1.5 md:px-3 md:py-2 rounded-lg">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xs md:text-sm">
              AD
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden xl:block">Admin</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
