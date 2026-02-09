import React from 'react';
import { 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart as PieChartIcon, 
  Activity, 
  ArrowUpRight,
  Download,
  Calendar
} from 'lucide-react';

const Analytics: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0a0b1e]">
       {/* Gradient Background */}
       <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
       
       {/* Header Section */}
       <header className="flex flex-col gap-6 px-8 py-8 z-10 shrink-0">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
               <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                  <span>Dashboard</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-white font-medium">Analytics</span>
               </div>
               <h1 className="text-3xl font-display font-bold text-white tracking-tight">Financial Report</h1>
               <p className="text-gray-400 mt-1 text-sm">Deep dive into your revenue streams and spending patterns.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-surface border border-white/10 hover:bg-white/5 text-white text-sm font-medium transition-all">
                  <Calendar className="w-4 h-4" />
                  <span>Oct 2023</span>
               </button>
               <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all shadow-lg shadow-primary/20">
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
               </button>
            </div>
         </div>
       </header>

       {/* Main Content */}
       <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 z-10 custom-scrollbar">
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <KPICard 
                  title="Total Savings"
                  amount="$24,500.00"
                  trend="+12.5%"
                  icon={<DollarSign className="w-6 h-6 text-primary" />}
                  color="primary"
              />
              <KPICard 
                  title="Monthly Burn"
                  amount="$4,200.00"
                  trend="-2.4%"
                  isNegative
                  icon={<Activity className="w-6 h-6 text-cyan-400" />}
                  color="cyan-400"
              />
              <KPICard 
                  title="Net Worth"
                  amount="$142,593.00"
                  trend="+5.2%"
                  icon={<TrendingUp className="w-6 h-6 text-green-400" />}
                  color="green-400"
              />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Main Chart Section */}
              <div className="lg:col-span-2 bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-white">Cash Flow</h3>
                      <div className="flex bg-[#0a0b1e] rounded-lg p-1 border border-white/5">
                          <button className="px-3 py-1 text-xs font-medium bg-white/10 text-white rounded-md">Year</button>
                          <button className="px-3 py-1 text-xs font-medium text-gray-400 hover:text-white rounded-md">Month</button>
                      </div>
                  </div>
                  
                  {/* CSS-only Bar Chart */}
                  <div className="h-64 flex items-end justify-between gap-4 px-2">
                      {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95].map((h, i) => (
                          <div key={i} className="w-full flex flex-col justify-end group cursor-pointer h-full">
                              <div className="relative w-full bg-gradient-to-t from-primary/20 to-primary/80 rounded-t-sm transition-all duration-300 group-hover:from-cyan-400/20 group-hover:to-cyan-400/80" style={{ height: `${h}%` }}>
                                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface border border-white/10 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                      ${h}k
                                  </div>
                              </div>
                              <div className="h-1 w-full bg-white/5 mt-1 rounded-full"></div>
                          </div>
                      ))}
                  </div>
                  <div className="flex justify-between mt-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                      <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                      <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                  </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-6">Spending by Category</h3>
                  <div className="flex-1 flex flex-col justify-center space-y-6">
                      <CategoryBar label="Housing" percentage={40} amount="$2,034" color="bg-primary" />
                      <CategoryBar label="Food" percentage={24} amount="$1,162" color="bg-cyan-400" />
                      <CategoryBar label="Transport" percentage={18} amount="$871" color="bg-pink-500" />
                      <CategoryBar label="Shopping" percentage={12} amount="$540" color="bg-orange-400" />
                      <CategoryBar label="Others" percentage={6} amount="$235" color="bg-gray-500" />
                  </div>
              </div>
          </div>

          {/* AI Insights Banner */}
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="text-white w-6 h-6" />
                  </div>
                  <div>
                      <h4 className="text-lg font-bold text-white mb-1">AI Insight: Savings Opportunity</h4>
                      <p className="text-gray-400 text-sm max-w-xl">
                          Based on your spending habits, you could save an additional <span className="text-white font-bold">$450/month</span> by optimizing your subscription services and dining expenses.
                      </p>
                  </div>
              </div>
              <button className="whitespace-nowrap px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors">
                  View Recommendations
              </button>
          </div>
       </div>
    </div>
  );
};

const KPICard = ({ title, amount, trend, icon, color, isNegative }: any) => (
    <div className="bg-surface/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-6 opacity-10 transition-transform group-hover:scale-110 text-${color}`}>
            {React.cloneElement(icon, { size: 48 })}
        </div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white mb-2">{amount}</h3>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md w-fit ${
            isNegative 
            ? 'text-red-400 bg-red-400/10 border border-red-400/20' 
            : 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
        }`}>
            {isNegative ? <TrendingDown className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
            {trend}
        </div>
    </div>
);

const CategoryBar = ({ label, percentage, amount, color }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between text-sm">
            <span className="text-white font-medium">{label}</span>
            <span className="text-gray-400">{amount} ({percentage}%)</span>
        </div>
        <div className="h-2 w-full bg-[#0a0b1e] rounded-full overflow-hidden">
            <div 
                className={`h-full rounded-full ${color} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} 
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
);

export default Analytics;