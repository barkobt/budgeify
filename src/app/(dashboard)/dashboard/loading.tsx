/**
 * Dashboard Loading — Safety Render
 * Prevents white screen while dashboard hydrates.
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 animate-pulse" />
        <span className="text-xl font-bold text-white tracking-tight">Budgeify</span>
      </div>
      <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest animate-pulse">
        Dashboard Yukleniyor...
      </p>
      <div className="mt-8 flex gap-3">
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
