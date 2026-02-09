import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  Search, 
  Bell, 
  Settings, 
  LayoutDashboard,
  PieChart,
  Target,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import Transactions from './Transactions';
import Analytics from './Analytics';
import Goals from './Goals';
import SettingsPage from './Settings';

interface DashboardProps {
  onBack: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'transactions':
        return <Transactions />;
      case 'analytics':
        return <Analytics />;
      case 'goals':
        return <Goals />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <OverviewContent onBack={onBack} onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-surface border-r border-white/5 flex flex-col flex-shrink-0 z-20 transition-all duration-300">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-white/5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Wallet className="text-white w-4 h-4" />
            </div>
            <span className="hidden lg:block font-display font-bold text-lg tracking-tight">Budgeify</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          <NavItem icon={<LayoutDashboard />} label="Dashboard" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
          <NavItem icon={<CreditCard />} label="Transactions" active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
          <NavItem icon={<PieChart />} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
          <NavItem icon={<Target />} label="Goals" active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} />
        </nav>

        <div className="p-4 border-t border-white/5">
           <NavItem icon={<Settings />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
           <div className="mt-4 pt-4 border-t border-white/5">
             <button onClick={onBack} className="flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-white/5 w-full rounded-xl transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:block font-medium">Log Out</span>
             </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0a0b1e]">
        {renderContent()}
      </main>
    </div>
  );
};

const OverviewContent = ({ onBack, onNavigate }: { onBack: () => void, onNavigate: (tab: string) => void }) => (
  <>
    {/* Background Gradients */}
    <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
    
    {/* Header */}
    <header className="flex items-center justify-between px-8 py-5 z-20 border-b border-white/5 bg-surface/50 backdrop-blur-md">
       <div className="flex items-center gap-4">
         <button onClick={onBack} className="lg:hidden p-2 text-gray-400">
           <ArrowLeft />
         </button>
         <div>
           <h1 className="text-2xl font-display font-bold text-white">Overview</h1>
           <p className="text-sm text-gray-400">Welcome back, Alex</p>
         </div>
       </div>
       
       <div className="flex items-center gap-4">
         <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-64">
           <Search className="text-gray-400 w-4 h-4 mr-2" />
           <input className="bg-transparent border-none outline-none text-sm w-full text-gray-200 placeholder-gray-500" placeholder="Search..." type="text" />
         </div>
         <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors relative">
           <Bell className="w-5 h-5" />
           <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full"></span>
         </button>
         <div className="flex items-center gap-3 pl-4 border-l border-white/10">
           <img src="https://i.pravatar.cc/150?img=33" alt="User" className="w-9 h-9 rounded-full border border-primary/50" />
           <span className="hidden md:block text-sm font-medium">Alex M.</span>
         </div>
       </div>
    </header>

    {/* Dashboard Content */}
    <div className="flex-1 overflow-y-auto p-8 z-10 scroll-smooth">
        
        {/* Total Balance Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-surface to-primary/10 border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Wallet className="w-48 h-48 text-white" />
                </div>
                <div className="relative z-10">
                    <p className="text-gray-400 text-sm font-medium mb-1">Total Balance</p>
                    <h2 className="text-5xl font-bold text-white mb-4 tracking-tight">$124,500<span className="text-2xl text-gray-400 font-normal">.00</span></h2>
                    <div className="flex items-center gap-2 mb-8">
                         <span className="flex items-center text-green-400 bg-green-400/10 px-2 py-1 rounded-lg text-sm font-medium">
                             <ArrowUpRight className="w-4 h-4 mr-1" /> +12.5%
                         </span>
                         <span className="text-gray-400 text-sm">vs last month</span>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors">Transfer</button>
                        <button className="px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors border border-white/10">Receive</button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
                <StatCard 
                    title="Income" 
                    amount="$12,400" 
                    icon={<ArrowUpRight className="text-green-400" />} 
                    bg="bg-green-500/10"
                    trend="+8%"
                    trendColor="text-green-400"
                />
                <StatCard 
                    title="Expenses" 
                    amount="$4,200" 
                    icon={<ArrowDownLeft className="text-red-400" />} 
                    bg="bg-red-500/10"
                    trend="-2%"
                    trendColor="text-green-400"
                />
                 <StatCard 
                    title="Investments" 
                    amount="$45,000" 
                    icon={<TrendingUp className="text-primary" />} 
                    bg="bg-primary/10"
                    trend="+15%"
                    trendColor="text-primary"
                />
            </div>
        </div>

        {/* Charts & Transactions Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Area */}
            <div className="lg:col-span-2 bg-surface border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Analytics</h3>
                    <div className="flex bg-white/5 rounded-lg p-1">
                        <button className="px-3 py-1 text-xs font-medium bg-white/10 text-white rounded-md">Week</button>
                        <button className="px-3 py-1 text-xs font-medium text-gray-400 hover:text-white rounded-md">Month</button>
                        <button className="px-3 py-1 text-xs font-medium text-gray-400 hover:text-white rounded-md">Year</button>
                    </div>
                </div>
                {/* Mock Chart */}
                <div className="h-64 w-full relative">
                    <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-between px-2 gap-2">
                         {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95].map((h, i) => (
                             <div key={i} className="w-full bg-white/5 rounded-t-sm relative group hover:bg-primary/50 transition-colors cursor-pointer" style={{ height: `${h}%` }}>
                                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                     ${h}k
                                 </div>
                             </div>
                         ))}
                    </div>
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        <div className="border-t border-white/5 w-full"></div>
                        <div className="border-t border-white/5 w-full"></div>
                        <div className="border-t border-white/5 w-full"></div>
                        <div className="border-t border-white/5 w-full"></div>
                        <div className="border-t border-white/5 w-full"></div>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-surface border border-white/10 rounded-2xl p-6">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
                    <button className="text-xs text-primary hover:text-white transition-colors" onClick={() => onNavigate('transactions')}>View All</button>
                </div>
                <div className="space-y-4">
                    <TransactionItem 
                        icon="netflix"
                        name="Netflix Subscription"
                        date="Today, 9:00 AM"
                        amount="-$15.00"
                        type="expense"
                    />
                    <TransactionItem 
                        icon="spotify"
                        name="Spotify Premium"
                        date="Yesterday"
                        amount="-$12.00"
                        type="expense"
                    />
                    <TransactionItem 
                        icon="work"
                        name="Salary Deposit"
                        date="Oct 24, 2024"
                        amount="+$4,500.00"
                        type="income"
                    />
                     <TransactionItem 
                        icon="apple"
                        name="Apple Store"
                        date="Oct 22, 2024"
                        amount="-$999.00"
                        type="expense"
                    />
                     <TransactionItem 
                        icon="coffee"
                        name="Starbucks"
                        date="Oct 20, 2024"
                        amount="-$8.50"
                        type="expense"
                    />
                </div>
            </div>
        </div>

    </div>
  </>
);

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) => (
    <div 
        onClick={onClick}
        className={`flex items-center gap-4 px-3 py-3 rounded-xl cursor-pointer transition-all group ${active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
    >
        <span className={active ? 'text-primary' : 'text-gray-400 group-hover:text-white'}>
            {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
        </span>
        <span className="hidden lg:block font-medium text-sm">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary hidden lg:block"></div>}
    </div>
);

const StatCard = ({ title, amount, icon, bg, trend, trendColor }: any) => (
    <div className="bg-surface border border-white/10 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-400 text-xs">{title}</p>
                <p className="text-xl font-bold text-white">{amount}</p>
            </div>
        </div>
        <span className={`text-xs font-medium ${trendColor}`}>{trend}</span>
    </div>
);

const TransactionItem = ({ icon, name, date, amount, type }: any) => {
    let iconEl;
    if (icon === 'netflix') iconEl = <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs">N</div>;
    else if (icon === 'spotify') iconEl = <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">S</div>;
    else if (icon === 'work') iconEl = <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs"><BriefcaseIcon /></div>;
    else if (icon === 'apple') iconEl = <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-xs"><AppleIcon /></div>;
    else iconEl = <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs"><CoffeeIcon /></div>;

    return (
        <div className="flex items-center justify-between p-2 hover:bg-white/5 rounded-xl transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
                {iconEl}
                <div>
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="text-xs text-gray-500">{date}</p>
                </div>
            </div>
            <span className={`text-sm font-bold ${type === 'income' ? 'text-green-400' : 'text-white'}`}>{amount}</span>
        </div>
    )
}

// Simple icons for transaction list
const BriefcaseIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const AppleIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 2 13 4 14 4C15 4 16 2 16 2C16 2 14.5 0.5 12 0.5C9.5 0.5 8 2 8 2C8 2 9 4 10 4C11 4 12 2 12 2ZM12 5C14.5 5 16 6.5 16 6.5C16 6.5 14.5 8 14.5 10.5C14.5 13 16 14.5 16 14.5C16 14.5 14.5 19 12 19C9.5 19 8 14.5 8 14.5C8 14.5 9.5 13 9.5 10.5C9.5 8 8 6.5 8 6.5C8 6.5 9.5 5 12 5Z" /></svg>; // Simplified
const CoffeeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>;


export default Dashboard;