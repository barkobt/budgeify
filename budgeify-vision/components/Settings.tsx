import React from 'react';
import { 
  ChevronRight, 
  User, 
  Bell, 
  Lock, 
  Moon, 
  Shield, 
  Globe, 
  CreditCard,
  LogOut
} from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-[#0a0b1e]">
       {/* Gradient Background */}
       <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
       
       {/* Header Section */}
       <header className="flex flex-col gap-6 px-8 py-8 z-10 shrink-0">
         <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
               <span>Dashboard</span>
               <ChevronRight className="w-3 h-3" />
               <span className="text-white font-medium">Settings</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">Account Settings</h1>
            <p className="text-gray-400 mt-1 text-sm">Manage your profile, preferences and security.</p>
         </div>
       </header>

       {/* Content */}
       <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 z-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Profile Section */}
              <section className="bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Profile Information
                  </h2>
                  
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                      <div className="flex flex-col items-center gap-3">
                          <img 
                              src="https://i.pravatar.cc/150?img=33" 
                              alt="Profile" 
                              className="w-24 h-24 rounded-full border-2 border-primary shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                          />
                          <button className="text-xs font-medium text-primary hover:text-white transition-colors">Change Photo</button>
                      </div>
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                          <div className="space-y-2">
                              <label className="text-xs font-medium text-gray-400 uppercase">First Name</label>
                              <input type="text" defaultValue="Alex" className="w-full bg-[#0a0b1e]/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-xs font-medium text-gray-400 uppercase">Last Name</label>
                              <input type="text" defaultValue="Morgan" className="w-full bg-[#0a0b1e]/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-xs font-medium text-gray-400 uppercase">Email Address</label>
                              <input type="email" defaultValue="alex.morgan@example.com" className="w-full bg-[#0a0b1e]/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-xs font-medium text-gray-400 uppercase">Phone</label>
                              <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full bg-[#0a0b1e]/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary transition-colors" />
                          </div>
                      </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                      <button className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary/20">
                          Save Changes
                      </button>
                  </div>
              </section>

              {/* Preferences */}
              <section className="bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      App Preferences
                  </h2>
                  <div className="space-y-4">
                      <SettingsToggle 
                          icon={<Bell className="w-5 h-5" />} 
                          title="Push Notifications" 
                          description="Receive alerts about your transactions and goals." 
                          checked 
                      />
                      <SettingsToggle 
                          icon={<Moon className="w-5 h-5" />} 
                          title="Dark Mode" 
                          description="Use dark theme for the application interface." 
                          checked 
                      />
                       <SettingsToggle 
                          icon={<Globe className="w-5 h-5" />} 
                          title="Currency" 
                          description="Display amounts in USD ($)." 
                          checked 
                      />
                  </div>
              </section>

              {/* Security */}
               <section className="bg-surface/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8">
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      Security & Privacy
                  </h2>
                  <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-white/5 text-gray-300">
                                  <Lock className="w-5 h-5" />
                              </div>
                              <div>
                                  <h4 className="font-medium text-white">Change Password</h4>
                                  <p className="text-xs text-gray-400">Last changed 3 months ago</p>
                              </div>
                          </div>
                          <button className="px-4 py-2 border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 transition-colors">Update</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-white/5 text-gray-300">
                                  <CreditCard className="w-5 h-5" />
                              </div>
                              <div>
                                  <h4 className="font-medium text-white">Payment Methods</h4>
                                  <p className="text-xs text-gray-400">Manage connected cards and banks</p>
                              </div>
                          </div>
                          <button className="px-4 py-2 border border-white/10 rounded-lg text-sm text-white hover:bg-white/5 transition-colors">Manage</button>
                      </div>

                       <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/20 mt-8">
                          <div className="flex items-center gap-4">
                              <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                  <LogOut className="w-5 h-5" />
                              </div>
                              <div>
                                  <h4 className="font-medium text-white">Log Out All Devices</h4>
                                  <p className="text-xs text-gray-400">Sign out from all active sessions</p>
                              </div>
                          </div>
                          <button className="px-4 py-2 border border-red-500/30 text-red-400 rounded-lg text-sm hover:bg-red-500/10 transition-colors">Log Out</button>
                      </div>
                  </div>
              </section>

          </div>
       </div>
    </div>
  );
};

const SettingsToggle = ({ icon, title, description, checked }: any) => (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
        <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-white/5 text-gray-300 group-hover:text-white transition-colors">
                {icon}
            </div>
            <div>
                <h4 className="font-medium text-white">{title}</h4>
                <p className="text-xs text-gray-400">{description}</p>
            </div>
        </div>
        <div className={`w-12 h-6 rounded-full relative transition-colors ${checked ? 'bg-primary' : 'bg-gray-600'}`}>
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'left-7' : 'left-1'}`}></div>
        </div>
    </div>
);

export default Settings;