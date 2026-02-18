import { useState, useEffect } from "react";
import Sidebar from "./components/sidebar";
import Navbar from "./components/navbar";
import UploadCard from "./components/uploadcard";
import KPICard from "./components/kpicard";
import DataTable from "./components/dataTable";
import ChartSection from "./components/chartSection";
import CorrelationMatrix from "./components/correlationMatrix";
import InsightsPanel from "./components/insightsPanel";
import ColumnProfile from "./components/columnProfile";
import FilterBar from "./components/filterBar";
import BusinessManager from "./components/businessManager";
import Header from "./components/branding/Header";
import Footer from "./components/branding/Footer";
import HeroCanvas from "./components/branding/HeroCanvas";


export default function App() {
  const [uploaded, setUploaded] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [dataProfile, setDataProfile] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Apply dark mode class to root immediately
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Also set on body for safety
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const handleFileUpload = (profile) => {
    setUploaded(true);
    setDataProfile(profile);
    setActiveTab("overview");
  };

  return (
    <div className="w-full min-h-full flex flex-col bg-[#030305] text-white font-['Inter'] relative">
      <HeroCanvas />
      <Header />

      <div className="flex flex-1 pt-[80px] overflow-hidden relative z-10">
        <Sidebar
          darkMode={darkMode}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
        />

        <div className="flex flex-col flex-1 w-full overflow-hidden bg-transparent transition-colors duration-200 min-w-0">
          <Navbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-auto bg-black/20 backdrop-blur-sm">
            {(!uploaded && ["overview", "charts", "correlation", "data"].includes(activeTab)) ? (
              <UploadCard onUploadSuccess={handleFileUpload} />
            ) : (
              <>
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 overflow-x-auto border-b border-white/10">
                  {[
                    "overview", "charts", "correlation", "data", "inventory", "vendors", "employees"
                  ].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-3 font-medium transition-all duration-200 whitespace-nowrap border-b-2 ${activeTab === tab
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <FilterBar />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <KPICard data={dataProfile} />
                      </div>
                      <div className="lg:col-span-1">
                        <InsightsPanel data={dataProfile} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Charts Tab */}
                {activeTab === "charts" && (
                  <ChartSection />
                )}

                {/* Correlation Tab */}
                {activeTab === "correlation" && (
                  <CorrelationMatrix />
                )}

                {/* Data Tab */}
                {activeTab === "data" && (
                  <>
                    <ColumnProfile data={dataProfile} />
                    <DataTable />
                  </>
                )}

                {/* Management Tabs */}
                {activeTab === "inventory" && (
                  <BusinessManager category="goods" title="Inventory Management" idField="product_id" />
                )}
                {activeTab === "vendors" && (
                  <BusinessManager category="vendors" title="Vendor Management" idField="vendor_id" />
                )}
                {activeTab === "employees" && (
                  <BusinessManager category="employees" title="Employee Management" idField="employee_id" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
