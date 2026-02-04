export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Logo ve Başlık */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-blue-500/20">
          <span className="text-4xl">💰</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Budgeify
        </h1>
        <p className="text-lg text-slate-500">
          Kişisel Finans Yönetimi
        </p>
      </div>

      {/* Hoş Geldiniz Kartı */}
      <div className="w-full max-w-md glass rounded-2xl p-8 shadow-xl shadow-black/5">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 text-center">
          Hoş Geldiniz! 👋
        </h2>
        <p className="text-slate-600 text-center mb-6 leading-relaxed">
          Budgeify ile gelir ve giderlerinizi kolayca takip edin,
          harcama alışkanlıklarınızı analiz edin ve finansal
          hedeflerinize ulaşın.
        </p>

        {/* Özellik Listesi */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-slate-700">
            <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-lg">
              📊
            </span>
            <span>Gelir ve gider takibi</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <span className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-lg">
              📈
            </span>
            <span>Detaylı harcama analizi</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-lg">
              🎯
            </span>
            <span>Tasarruf hedefleri</span>
          </div>
        </div>

        {/* Başla Butonu */}
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
          Başlayalım
        </button>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-slate-400">
        Versiyon 1.0.0 • MVP
      </p>
    </main>
  );
}
