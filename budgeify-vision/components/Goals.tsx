import React from 'react';
import { 
  ChevronRight, 
  Plus, 
  Target, 
  Car, 
  Plane, 
  Home, 
  Shield, 
  MoreHorizontal,
  Computer
} from 'lucide-react';

const Goals: React.FC = () => {
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
                  <span className="text-white font-medium">Goals</span>
               </div>
               <h1 className="text-3xl font-display font-bold text-white tracking-tight">Financial Goals</h1>
               <p className="text-gray-400 mt-1 text-sm">Visualize your dreams and track your progress.</p>
            </div>
            <div>
               <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-1">
                  <Plus className="w-5 h-5" />
                  <span>Create New Goal</span>
               </button>
            </div>
         </div>
       </header>

       {/* Content */}
       <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 z-10 custom-scrollbar">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-surface/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-medium uppercase">Total Saved</p>
                        <p className="text-2xl font-bold text-white">$24,500</p>
                    </div>
                </div>
                <div className="bg-surface/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-medium uppercase">Active Goals</p>
                        <p className="text-2xl font-bold text-white">5</p>
                    </div>
                </div>
                <div className="bg-surface/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-medium uppercase">Completed</p>
                        <p className="text-2xl font-bold text-white">3</p>
                    </div>
                </div>
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <GoalCard 
                    icon={<Car className="w-8 h-8 text-white" />}
                    gradient="from-indigo-500 to-purple-600"
                    title="Tesla Model 3"
                    date="Dec 2024"
                    current="$35,000"
                    target="$55,000"
                    progress={65}
                    status="On Track"
                    statusColor="text-emerald-400"
                />
                <GoalCard 
                    icon={<Plane className="w-8 h-8 text-white" />}
                    gradient="from-orange-400 to-pink-600"
                    title="Bali Trip"
                    date="Aug 2024"
                    current="$1,500"
                    target="$5,000"
                    progress={30}
                    status="Needs Boost"
                    statusColor="text-yellow-400"
                />
                <GoalCard 
                    icon={<Shield className="w-8 h-8 text-white" />}
                    gradient="from-emerald-400 to-teal-600"
                    title="Safety Net"
                    date="Ongoing"
                    current="$9,000"
                    target="$10,000"
                    progress={90}
                    status="Almost There"
                    statusColor="text-emerald-400"
                />
                 <GoalCard 
                    icon={<Computer className="w-8 h-8 text-white" />}
                    gradient="from-slate-500 to-slate-700"
                    title="Mac Studio"
                    date="Feb 2025"
                    current="$400"
                    target="$4,000"
                    progress={10}
                    status="Just Started"
                    statusColor="text-blue-400"
                />
                <GoalCard 
                    icon={<Home className="w-8 h-8 text-white" />}
                    gradient="from-blue-600 to-cyan-500"
                    title="Dream Home"
                    date="2028"
                    current="$85,000"
                    target="$200,000"
                    progress={42}
                    status="On Track"
                    statusColor="text-emerald-400"
                />
                
                {/* Add New Placeholder */}
                <button className="bg-surface/20 backdrop-blur-sm border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-gray-400 hover:text-white hover:border-primary/50 hover:bg-surface/40 transition-all group min-h-[220px]">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8" />
                    </div>
                    <span className="font-medium">Add New Goal</span>
                </button>
            </div>
       </div>
    </div>
  );
};

const GoalCard = ({ icon, gradient, title, date, current, target, progress, status, statusColor }: any) => (
    <div className="bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:translate-y-[-4px] transition-transform duration-300 shadow-xl group">
        <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                {icon}
            </div>
            <button className="text-gray-400 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>
        
        <div className="flex justify-between items-end mb-4">
            <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-gray-400 text-xs font-medium">Target: {date}</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-bold text-white">{current}</p>
                <p className="text-gray-500 text-xs">of {target}</p>
            </div>
        </div>

        <div className="relative h-2 w-full bg-[#0a0b1e] rounded-full overflow-hidden mb-4">
            <div 
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${gradient} rounded-full`} 
                style={{ width: `${progress}%` }}
            ></div>
        </div>

        <div className="flex justify-between items-center text-xs font-medium">
            <span className="bg-white/10 text-white px-2 py-1 rounded">{progress}% Complete</span>
            <span className={statusColor}>{status}</span>
        </div>
    </div>
);

export default Goals;