'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Logo ve Başlık */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-500/20">
          <span className="text-4xl">💰</span>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Budgeify
        </h1>
        <p className="text-lg text-slate-500">
          Kişisel Finans Yönetimi
        </p>
      </div>

      {/* Hoş Geldiniz Kartı - Card Component ile */}
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Hoş Geldiniz! 👋</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Budgeify ile gelir ve giderlerinizi kolayca takip edin,
              harcama alışkanlıklarınızı analiz edin ve finansal
              hedeflerinize ulaşın.
            </p>

            {/* Özellik Listesi */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-700">
                <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-lg">
                  📊
                </span>
                <span className="text-sm">Gelir ve gider takibi</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <span className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-lg">
                  📈
                </span>
                <span className="text-sm">Detaylı harcama analizi</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <span className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-lg">
                  🎯
                </span>
                <span className="text-sm">Tasarruf hedefleri</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="primary" isFullWidth>
              Başlayalım
            </Button>
            <Button variant="ghost" isFullWidth>
              Daha Sonra
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Buton Varyantları Örneği */}
      <div className="w-full max-w-md mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Buton Varyantları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="primary" isFullWidth>
                Primary Buton
              </Button>
              <Button variant="secondary" isFullWidth>
                Secondary Buton
              </Button>
              <Button variant="outline" isFullWidth>
                Outline Buton
              </Button>
              <Button variant="ghost" isFullWidth>
                Ghost Buton
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <p className="mt-8 text-sm text-slate-400">
        Versiyon 1.0.0 • MVP
      </p>
    </main>
  );
}
