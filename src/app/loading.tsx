/**
 * Root Loading — Safety Render
 * Prevents white screen during route transitions.
 */
export default function RootLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505]">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 animate-pulse" />
        <span className="text-xl font-bold text-white tracking-tight">Budgeify</span>
      </div>
      <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest animate-pulse">
        Sistem Yukleniyor...
      </p>
    </div>
  );
}
