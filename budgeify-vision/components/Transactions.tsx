import React from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Music,
  Briefcase,
  Coffee,
  ShoppingBag,
  Film,
  Zap,
  Globe,
  CreditCard,
  DollarSign,
  Smartphone,
  Plane
} from 'lucide-react';

const Transactions: React.FC = () => {
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
                  <span className="text-white font-medium">Transactions</span>
               </div>
               <h1 className="text-3xl font-display font-bold text-white tracking-tight">Transaction History</h1>
               <p className="text-gray-400 mt-1 text-sm">View and manage all your financial movements in real-time.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-surface border border-white/10 hover:bg-white/5 text-white text-sm font-medium transition-all">
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
               </button>
               <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-all shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4" />
                  <span>Add Transaction</span>
               </button>
            </div>
         </div>

         {/* Filters Toolbar */}
         <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface/40 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-lg">
            {/* Search */}
            <div className="relative w-full md:w-80 group">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-primary transition-colors">
                  <Search className="w-4 h-4" />
               </div>
               <input 
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#0a0b1e]/50 border border-transparent focus:border-primary/50 rounded-lg text-white placeholder-gray-500 focus:outline-none text-sm transition-all" 
                  placeholder="Search merchant, category..." 
                  type="text" 
               />
            </div>
            
            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
               <FilterButton active label="All" />
               <FilterButton label="Income" />
               <FilterButton label="Expense" />
               <FilterButton label="Crypto" />
               <FilterButton label="Pending" />
               <div className="w-px h-6 bg-white/10 mx-2 hidden md:block"></div>
               <button className="flex items-center gap-1 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors">
                  <span>This Month</span>
                  <ChevronRight className="w-3 h-3 rotate-90" />
               </button>
            </div>
         </div>
       </header>

       {/* Table Container */}
       <div className="flex-1 overflow-hidden px-6 md:px-8 pb-8 z-10">
          <div className="h-full rounded-2xl border border-white/10 bg-surface/40 backdrop-blur-md flex flex-col shadow-2xl overflow-hidden relative">
             {/* Table Header */}
             <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-[#0a0b1e]/80 text-xs font-semibold text-gray-400 uppercase tracking-wider sticky top-0 z-20">
                <div className="col-span-4 md:col-span-3 flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                   Transaction / Merchant
                </div>
                <div className="col-span-2 hidden md:flex items-center cursor-pointer hover:text-white transition-colors">
                   Category
                </div>
                <div className="col-span-3 md:col-span-2 flex items-center cursor-pointer hover:text-white transition-colors">
                   Date
                </div>
                <div className="col-span-2 hidden md:flex items-center cursor-pointer hover:text-white transition-colors">
                   Status
                </div>
                <div className="col-span-3 md:col-span-2 flex items-center justify-end cursor-pointer hover:text-white transition-colors">
                   Amount
                </div>
                <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                   Action
                </div>
             </div>

             {/* Table Rows */}
             <div className="overflow-y-auto flex-1 custom-scrollbar">
                <TransactionRow 
                  icon={<Music className="w-5 h-5 text-green-400" />} 
                  iconBg="bg-green-500/10 border-green-500/20"
                  name="Spotify Premium"
                  sub="Subscription"
                  category="Entertainment"
                  date="Oct 24, 2024"
                  time="10:42 AM"
                  status="Completed"
                  statusColor="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                  amount="-$14.99"
                  amountColor="text-pink-400"
                />
                <TransactionRow 
                  icon={<Briefcase className="w-5 h-5 text-cyan-400" />} 
                  iconBg="bg-cyan-500/10 border-cyan-500/20"
                  name="Tech Corp Inc."
                  sub="Direct Deposit"
                  category="Salary"
                  date="Oct 23, 2024"
                  time="09:00 AM"
                  status="Completed"
                  statusColor="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                  amount="+$4,250.00"
                  amountColor="text-cyan-400"
                />
                <TransactionRow 
                  icon={<Coffee className="w-5 h-5 text-orange-400" />} 
                  iconBg="bg-orange-500/10 border-orange-500/20"
                  name="Starbucks"
                  sub="Coffee"
                  category="Food & Dining"
                  date="Oct 22, 2024"
                  time="08:15 AM"
                  status="Completed"
                  statusColor="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                  amount="-$6.50"
                  amountColor="text-pink-400"
                />
                <TransactionRow 
                  icon={<DollarSign className="w-5 h-5 text-yellow-500" />} 
                  iconBg="bg-yellow-500/10 border-yellow-500/20"
                  name="Bitcoin Purchase"
                  sub="Coinbase"
                  category="Investment"
                  date="Oct 21, 2024"
                  time="04:15 PM"
                  status="Pending"
                  statusColor="text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
                  amount="-$500.00"
                  amountColor="text-white"
                />
                <TransactionRow 
                  icon={<Smartphone className="w-5 h-5 text-white" />} 
                  iconBg="bg-white/10 border-white/20"
                  name="Apple Store"
                  sub="Electronics"
                  category="Tech"
                  date="Oct 20, 2024"
                  time="11:30 AM"
                  status="Completed"
                  statusColor="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                  amount="-$1,299.00"
                  amountColor="text-pink-400"
                />
                 <TransactionRow 
                  icon={<Plane className="w-5 h-5 text-blue-400" />} 
                  iconBg="bg-blue-500/10 border-blue-500/20"
                  name="Delta Airlines"
                  sub="Travel"
                  category="Travel"
                  date="Oct 18, 2024"
                  time="02:20 PM"
                  status="Completed"
                  statusColor="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                  amount="-$450.00"
                  amountColor="text-pink-400"
                />
                 <TransactionRow 
                  icon={<Zap className="w-5 h-5 text-purple-400" />} 
                  iconBg="bg-purple-500/10 border-purple-500/20"
                  name="Electric Bill"
                  sub="Utilities"
                  category="Bills"
                  date="Oct 15, 2024"
                  time="09:00 AM"
                  status="Completed"
                  statusColor="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                  amount="-$124.50"
                  amountColor="text-pink-400"
                />
                 <TransactionRow 
                  icon={<ShoppingBag className="w-5 h-5 text-white" />} 
                  iconBg="bg-white/5 border-white/10"
                  name="Whole Foods"
                  sub="Groceries"
                  category="Food"
                  date="Oct 14, 2024"
                  time="06:45 PM"
                  status="Completed"
                  statusColor="text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                  amount="-$156.42"
                  amountColor="text-pink-400"
                />
             </div>

             {/* Footer Pagination */}
             <div className="px-6 py-4 border-t border-white/5 bg-[#0a0b1e]/50 flex items-center justify-between text-xs text-gray-400 shrink-0">
                <div>Showing <span className="text-white font-medium">1-8</span> of <span className="text-white font-medium">124</span> transactions</div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                      <span className="hidden sm:inline">Rows per page:</span>
                      <select className="bg-[#0a0b1e] border border-white/10 rounded text-white text-xs py-1 px-2 focus:outline-none focus:border-primary">
                         <option>10</option>
                         <option>25</option>
                         <option>50</option>
                      </select>
                   </div>
                   <div className="flex gap-1">
                      <button className="p-1 rounded hover:bg-white/10 text-gray-400 disabled:opacity-50" disabled>
                         <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button className="p-1 rounded hover:bg-white/10 text-white">
                         <ChevronRight className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const FilterButton = ({ label, active }: { label: string, active?: boolean }) => (
    <button className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
        active 
        ? 'bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] border border-primary' 
        : 'bg-[#0a0b1e] text-gray-400 border border-white/10 hover:border-primary hover:text-white'
    }`}>
        {label}
    </button>
);

const TransactionRow = ({ icon, iconBg, name, sub, category, date, time, status, statusColor, amount, amountColor }: any) => (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center group animate-fade-in">
        <div className="col-span-4 md:col-span-3 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${iconBg}`}>
                {icon}
            </div>
            <div className="flex flex-col overflow-hidden">
                <span className="text-white text-sm font-medium truncate">{name}</span>
                <span className="text-gray-500 text-xs truncate">{sub}</span>
            </div>
        </div>
        <div className="col-span-2 hidden md:flex items-center">
            <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
                {category}
            </span>
        </div>
        <div className="col-span-3 md:col-span-2 text-gray-400 text-sm">
            {date} <span className="text-xs opacity-50 ml-1 hidden sm:inline">{time}</span>
        </div>
        <div className="col-span-2 hidden md:flex items-center">
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${status === 'Pending' ? 'bg-yellow-500' : 'bg-emerald-400'}`}></span> 
                {status}
            </span>
        </div>
        <div className={`col-span-3 md:col-span-2 text-right font-mono font-medium tracking-tight ${amountColor}`}>
            {amount}
        </div>
        <div className="col-span-2 md:col-span-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export default Transactions;