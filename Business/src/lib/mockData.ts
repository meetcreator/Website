export const generateRevenueData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((month) => ({
        name: month,
        revenue: Math.floor(Math.random() * 50000) + 20000,
        profit: Math.floor(Math.random() * 20000) + 5000,
    }));
};

export const b2bClients = [
    { name: "Global Logistics Inc.", value: 125000, growth: "+12%" },
    { name: "TechFlow Systems", value: 98400, growth: "+8%" },
    { name: "Nexus Healthcare", value: 76000, growth: "+15%" },
    { name: "Urban Retail Group", value: 54000, growth: "-2%" },
    { name: "Stellar Manufacturing", value: 42000, growth: "+5%" },
];

export const b2cSegments = [
    { name: "Loyal Customers", value: 45, color: "#3b82f6" },
    { name: "New Users", value: 25, color: "#8b5cf6" },
    { name: "At Risk", value: 20, color: "#f59e0b" },
    { name: "Churned", value: 10, color: "#ef4444" },
];
